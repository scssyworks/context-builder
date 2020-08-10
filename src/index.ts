import { Select } from "./Select";
import { CursorPlacement } from "./CursorPlacement";
import { Beacon } from "./Beacon";

export interface ContextMenuConfig<T extends HTMLElement, U extends Event> {
    rootElement?: T;
    onClick?: (event: U) => boolean | void;
    onActivate?: (elements: Select) => void;
    onDeactivate?: (elements: Select, callback: () => void) => void;
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
    #beacon: Beacon<T>;
    #exitFunction = (): void => {
        this.rootElement = this.rootElement.detach().children();
        this.#open = false;
        this.#active = false;
    }
    #onClick = (): void => {
        if (this.#active) {
            if (
                this.config
                && typeof this.config.onDeactivate === 'function'
            ) {
                this.#open = true;
                this.config.onDeactivate(this.rootElement, this.#exitFunction);
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
            this.contextTarget.append(this.rootElement);
            new CursorPlacement(e, this.rootElement);
            if (
                this.config
                && typeof this.config.onActivate === 'function'
            ) {
                this.rootElement.repaint();
                this.config.onActivate(this.rootElement);
            }
        }
    }
    #onRootClick = (e: Event): void => {
        e.stopPropagation();
        if (
            this.config
            && typeof this.config.onClick === 'function'
        ) {
            const shouldExit = this.config.onClick.apply(new Select(e.target), [e]);
            if (shouldExit) {
                this.#onClick();
            }
        }
    }
    contextTarget: Select;
    isSupported: boolean;
    rootElement: Select;
    config: ContextMenuConfig<T, Event> = {};
    constructor(target: string | null, config?: ContextMenuConfig<T, Event>) {
        this.#beacon = new Beacon(this);
        if (config && typeof config === 'object') {
            this.config = Object.freeze(config);
        }
        this.contextTarget = typeof target === 'string'
            ? new Select(target)
            : new Select().getBodyTag();
        this.isSupported = !!this.contextTarget.body;
        this.rootElement = Select.create(
            this.config && this.config.rootElement
                ? this.config.rootElement
                : `<ul class="context-menu-list"></ul>`
        );
        this.contextTarget
            .on('contextmenu', this.#onContextMenu);
        if (typeof document !== 'undefined') {
            new Select(document).on('click', this.#onClick);
        }
        this.#beacon.listen((shouldClose) => {
            if (shouldClose) {
                this.#onClick();
            }
        });
        this.rootElement.on('click', this.#onRootClick);
    }
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
    cleanup(): void {
        this.contextTarget
            .off('contextmenu', this.#onContextMenu)
            .off('click', this.#onClick);
        this.rootElement.off('click', this.#onRootClick);
        this.#beacon.off();
    }
}

// Generates a context list
export class ContextList<T extends HTMLElement, U extends HTMLElement> {
    config: ContextListConfig<T, U> = {};
    rootElement: Select;
    listElement: Select;
    constructor(title: string, config?: ContextListConfig<T, U>) {
        if (config && typeof config === 'object') {
            this.config = Object.freeze(config);
        }
        this.rootElement = Select.create(
            this.config && this.config.rootElement
                ? this.config.rootElement
                : `<li class="menu-item"></li>`
        );
        this.rootElement.setAttr({
            'data-has-sub-elements': true
        });
        this.listElement = Select.create(
            this.config && this.config.listElement
                ? this.config.listElement
                : `<ul class="context-submenu"></ul>`
        );
        this.rootElement
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
}

// Generates a context item
export class ContextItem<T extends HTMLElement> {
    config: ContextItemConfig<T> = {};
    rootElement: Select;
    constructor(title: string, config?: ContextItemConfig<T>) {
        if (config && typeof config === 'object') {
            this.config = Object.freeze(config);
        }
        this.rootElement = Select.create(
            this.config && this.config.rootElement
                ? this.config.rootElement
                : `<li class="menu-item"></li>`
        );
        this.rootElement.append(title);
    }
}