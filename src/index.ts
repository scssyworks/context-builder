import { Select } from "./Select";
import { CursorPlacement } from "./CursorPlacement";
import { Beacon } from "./Beacon";
import isPromise from 'is-promise';
import { EventManager, ContextMenuEventMap } from "./EventManager";

export interface ContextMenuConfig<T extends HTMLElement, U extends Event> {
    rootElement?: T;
    onClick?: (event: U) => boolean | void;
    onActivate?: (elements: Select) => void;
    onDeactivate?: (elements: Select, callback: () => void) => void;
    onContextMenu?: (event: U) => void;
    onBeforeCleanup?: () => (boolean | Promise<boolean>);
}

export interface ContextListConfig<T extends HTMLElement, U extends HTMLElement> {
    rootElement?: T;
    listElement?: U;
}

export interface ContextItemConfig<T extends HTMLElement> {
    rootElement?: T;
}

export class ContextMenu<T extends HTMLElement> {
    #open = false;
    #active = false;
    #doc = typeof document !== 'undefined' && (new Select(document));
    #beacon: Beacon<T>;
    #eventManager: EventManager<Event>;
    #body: Select;
    contextTarget: Select;
    isSupported: boolean;
    rootElement: Select;
    config: ContextMenuConfig<T, Event> = {};
    constructor(target?: string | null, config?: ContextMenuConfig<T, Event>) {
        this.#beacon = new Beacon(this);
        this.config = Object.freeze((typeof config === 'object' && config) || {});
        this.#body = new Select().getBodyTag();
        this.contextTarget = typeof target === 'string'
            ? new Select(target)
            : this.#body;
        this.isSupported = Boolean(this.contextTarget.elements.length);
        this.rootElement = Select.create(
            this.config.rootElement
                ? this.config.rootElement
                : `<ul class="context-menu-list"></ul>`
        )
            .setAttr({ 'data-context-menu-root': true })
            .on('click', this.#onRootClick);
        this.contextTarget
            .setAttr({ 'data-context-menu-enabled': true })
            .on('contextmenu', this.#onContextMenu);
        if (this.#doc) {
            this.#doc.on('click', this.#onClick);
        }
        this.#beacon.listen((shouldClose) => {
            if (shouldClose) {
                this.#onClick();
            }
        });
        this.#eventManager = new EventManager<Event>(this.rootElement);
    }
    // Private functions
    #exitFunction = (...args: any[]): void => {
        this.rootElement = this.rootElement.detach().children();
        this.#open = false;
        this.#active = false;
        this.#eventManager.emit('closed', ...args);
    }
    #onClick = (): void => {
        if (this.#active) {
            if (typeof this.config.onDeactivate === 'function') {
                this.#open = true;
                this.config.onDeactivate(this.rootElement, this.#exitFunction);
            } else if (this.#eventManager.hasListener('deactivate')) {
                this.#eventManager.emit('deactivate', this.rootElement, this.#exitFunction);
            } else {
                this.#exitFunction();
            }
        }
    }
    #onContextMenu = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation(); // For nested context menus
        this.#beacon.emit(); // Sends notification to other context menu instances to automatically close
        this.#active = true;
        if (!this.#open) {
            this.#body.append(this.rootElement);
            new CursorPlacement(e, this.rootElement);
            if (typeof this.config.onActivate === 'function') {
                this.rootElement.reflow();
                this.config.onActivate.apply(this.rootElement, [this.rootElement]);
            }
            if (typeof this.config.onContextMenu === 'function') {
                this.config.onContextMenu.apply(this.rootElement, [e]);
            }
            this.#eventManager.emit('activate', this.rootElement);
            this.#eventManager.emit('contextmenu', e);
        }
    }
    #onRootClick = (e: Event): void => {
        e.stopPropagation();
        if (typeof this.config.onClick === 'function') {
            const shouldExit = this.config.onClick.apply(new Select(e.target), [e]);
            if (shouldExit) {
                this.#onClick();
            }
        } else if (this.#eventManager.hasListener('click')) {
            const returnedValues = this.#eventManager.emit('click', e, new Select(e.target));
            returnedValues.forEach((shouldExit: boolean): void => {
                if (typeof shouldExit === 'boolean' && shouldExit) {
                    this.#onClick();
                }
            });
        }
    }
    #onBeforeCleanup = (cb: () => (boolean | Promise<boolean>)): boolean | Promise<boolean> | void => {
        if (typeof cb === 'function') {
            const result = cb();
            return (typeof result === 'undefined' || result);
        }
        return true;
    }
    #performCleanup = (): void => {
        this.contextTarget
            .off('contextmenu', this.#onContextMenu)
            .off('click', this.#onClick);
        this.rootElement.off('click', this.#onRootClick).remove();
        if (this.#doc) {
            this.#doc.off('click', this.#onClick);
        }
        this.#beacon.off();
        this.#eventManager.emit('cleaned');
        this.#eventManager.off();
    }
    // Public methods
    add(...args: (ContextList<HTMLElement, HTMLElement> | ContextItem<HTMLElement>)[]): ContextMenu<T> {
        const elements = [...args];
        for (const element of elements) {
            if (
                element instanceof ContextList
                || element instanceof ContextItem
            ) {
                this.rootElement.append(element.rootElement);
            }
        }
        return this;
    }
    async cleanup(): Promise<void> {
        this.#eventManager.emit('beforecleanup');
        if (typeof this.config.onBeforeCleanup === 'function') {
            const shouldCleanup = this.#onBeforeCleanup(this.config.onBeforeCleanup);
            if (typeof shouldCleanup === 'boolean' && shouldCleanup) {
                this.#performCleanup();
            } else if (isPromise(shouldCleanup)) {
                try {
                    const shouldCleanupPromise = await shouldCleanup;
                    if (shouldCleanupPromise) {
                        this.#performCleanup();
                    }
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                }
            }
        } else {
            this.#performCleanup();
        }
    }
    on<K extends keyof ContextMenuEventMap<Event>>(event: K, handler: ContextMenuEventMap<Event>[K]): ContextMenu<T> {
        this.#eventManager.on(event, handler);
        return this;
    }
    off<K extends keyof ContextMenuEventMap<Event>>(event?: K, handler?: ContextMenuEventMap<Event>[K]): ContextMenu<T> {
        this.#eventManager.off(event, handler);
        return this;
    }
}

// Generates a context list
export class ContextList<T extends HTMLElement, U extends HTMLElement> {
    config: ContextListConfig<T, U> = {};
    rootElement: Select;
    listElement: Select;
    constructor(title: string, config?: ContextListConfig<T, U>) {
        this.config = Object.freeze((typeof config === 'object' && config) || {});
        this.listElement = Select.create(
            this.config.listElement
                ? this.config.listElement
                : `<ul class="context-submenu"></ul>`
        )
            .setAttr({ 'data-context-submenu-root': true });
        this.rootElement = Select.create(
            this.config.rootElement
                ? this.config.rootElement
                : `<li class="menu-item"></li>`
        )
            .setAttr({
                'data-has-sub-elements': true
            })
            .append(title)
            .append(this.listElement);
    }
    get parent(): (Select | null) {
        return this.rootElement.parent;
    }
    add(...args: (ContextList<HTMLElement, HTMLElement> | ContextItem<HTMLElement>)[]): ContextList<T, U> {
        const elements = [...args];
        for (const element of elements) {
            if (
                element instanceof ContextList
                || element instanceof ContextItem
            ) {
                this.listElement.append(element.rootElement);
            }
        }
        return this;
    }
    remove(): void {
        this.rootElement.remove();
    }
}

// Generates a context item
export class ContextItem<T extends HTMLElement> {
    config: ContextItemConfig<T> = {};
    rootElement: Select;
    constructor(title: string, config?: ContextItemConfig<T>) {
        this.config = Object.freeze((typeof config === 'object' && config) || {});
        this.rootElement = Select.create(
            this.config.rootElement
                ? this.config.rootElement
                : `<li class="menu-item"></li>`
        )
            .setAttr({ 'data-is-context-menu-leaf': true })
            .append(title);
    }
    remove(): void {
        this.rootElement.remove();
    }
}