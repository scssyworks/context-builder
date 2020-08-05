import { Select } from './Select';
import { CursorPlacement } from './CursorPlacement';

export class ContextMenu {
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
        this.contextTarget
            .on('contextmenu', function (e) {
                e.preventDefault();
                (new Select(this)).append(ref.rootElement);
                new CursorPlacement(e, ref.rootElement);
                if (
                    ref.config
                    && typeof ref.config.onActivate === 'function'
                ) {
                    ref.rootElement.repaint();
                    config.onActivate(ref.rootElement.map());
                }
            })
            .on('click', () => {
                const exitFunction = () => {
                    this.rootElement = this.rootElement.detach().children();
                };
                if (
                    this.config
                    && typeof config.onDeactivate === 'function'
                ) {
                    config.onDeactivate(exitFunction);
                } else {
                    exitFunction();
                }
            });
        this.rootElement.on('click', (e) => {
            e.stopPropagation();
        });
    }
    add(element) {
        if (
            element instanceof ContextList
            || element instanceof ContextItem
        ) {
            this.rootElement.append(element.rootElement);
        }
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
        this.listElement = Select.create(
            this.config && this.config.listElement
                ? this.config.listElement
                : `<ul class="context-submenu"></ul>`
        );
        this.rootElement
            .append(title)
            .append(this.listElement);
    }
}

// Generates a context item
export class ContextItem { }