import { Select } from './Select';
import { CursorPlacement } from './CursorPlacement';


export class ContextMenu {
    #listeners = [];
    #open = false;
    constructor(target, config) {
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
        const ref = this;
        const onContextMenu = function (e) {
            e.preventDefault();
            if (!ref.#open) {
                (new Select(this)).append(ref.rootElement);
                new CursorPlacement(e, ref.rootElement);
                if (
                    ref.config
                    && typeof ref.config.onActivate === 'function'
                ) {
                    ref.rootElement.repaint();
                    config.onActivate(ref.rootElement);
                    ref.#open = true;
                }
            }
        };
        const exitFunction = () => {
            this.rootElement = this.rootElement.detach().children();
            this.#open = false;
        };
        const onClick = () => {
            if (
                this.config
                && typeof config.onDeactivate === 'function'
            ) {
                config.onDeactivate(this.rootElement, exitFunction);
            } else {
                exitFunction();
            }
        };
        const onRootClick = (e) => {
            e.stopPropagation();
            if (
                this.config
                && typeof this.config.onClick === 'function'
            ) {
                const shouldExit = this.config.onClick.apply(new Select(e.target), [e]);
                if (shouldExit) {
                    if (typeof this.config.onDeactivate === 'function') {
                        this.config.onDeactivate(this.rootElement, exitFunction);
                    } else {
                        exitFunction();
                    }
                }
            }
        };
        this.#listeners.push(
            { onContextMenu },
            { onClick },
            { onRootClick }
        );
        this.contextTarget
            .on('contextmenu', onContextMenu)
            .on('click', onClick);
        this.rootElement.on('click', onRootClick);
    }
    add() {
        const elements = [...arguments];
        for (const element of elements) {
            if (
                element instanceof ContextList
                || element instanceof ContextItem
            ) {
                this.rootElement.append(element.rootElement);
            }
        }
    }
    cleanup() {
        const { onContextMenu } = this.#listeners.filter(fn => Object.prototype.hasOwnProperty.call(fn, 'onContextMenu'))[0];
        const { onClick } = this.#listeners.filter(fn => Object.prototype.hasOwnProperty.call(fn, 'onClick'))[0];
        const { onRootClick } = this.#listeners.filter(fn => Object.prototype.hasOwnProperty.call(fn, 'onRootClick'))[0];
        this.contextTarget
            .off('contextmenu', onContextMenu)
            .off('click', onClick);
        this.rootElement.off('click', onRootClick);
    }
}

// Generates a context list
export class ContextList {
    constructor(title, config) {
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
    get parent() {
        return this.rootElement.parent;
    }
    add() {
        const elements = [...arguments];
        for (const element of elements) {
            if (
                element instanceof ContextList
                || element instanceof ContextItem
            ) {
                this.listElement.append(element.rootElement);
            }
        }
    }
}

// Generates a context item
export class ContextItem {
    constructor(title, config) {
        if (config && typeof config === 'object') {
            this.config = Object.freeze();
        }
        this.rootElement = Select.create(
            this.config && this.config.rootElement
                ? this.config.rootElement
                : `<li class="menu-item"></li>`
        );
        this.rootElement.append(title);
    }
}