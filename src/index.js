import { Select } from './Select';

export class ContextMenu {
    constructor(target) {
        this.contextTarget = typeof target === 'string'
            ? new Select(target)
            : new Select().getBodyTag();
        this.isSupported = !!this.contextTarget.body;
        this.rootElement = Select.create(`<ul class="context-menu-list context-hidden"></ul>`);
        const ref = this;
        this.contextTarget
            .on('contextmenu', function (e) {
                e.preventDefault();
                (new Select(this)).append(ref.rootElement);
            })
            .on('click', () => {
                this.rootElement = this.rootElement.detach().children();
            });
        this.rootElement.on('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Generates a context list
export class ContextList {

    constructor() {

    }
}

// Generates a context item
export class ContextItem { }