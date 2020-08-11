import { ContextMenu, ContextItem } from '../src';

const menu = new ContextMenu(null, {
    onClick() {
        console.log(this.textMap());
        console.log(this.getAllParents());
        return true;
    },
    onActivate(rootEl) {
        rootEl.map(el => {
            if (el instanceof HTMLElement) {
                el.classList.add('show')
            }
        });
    },
    onDeactivate(rootEl, fn) {
        rootEl.once('transitionend', fn);
        rootEl.map(el => {
            if (el instanceof HTMLElement) {
                el.classList.remove('show');
            }
        });
    }
});

const childMenu = new ContextMenu('h2.bg-secondary', {
    onClick() {
        console.log(this.textMap());
        return true;
    },
    onActivate(rootEl) {
        rootEl.map(el => {
            if (el instanceof HTMLElement) {
                el.classList.add('show')
            }
        });
    },
    onDeactivate(rootEl, fn) {
        rootEl.once('transitionend', fn);
        rootEl.map(el => {
            if (el instanceof HTMLElement) {
                el.classList.remove('show');
            }
        });
    }
});

menu.add(
    new ContextItem('List Item 1'),
    new ContextItem('List Item 2'),
    new ContextItem('List Item 3'),
    new ContextItem('List Item 4'),
    new ContextItem('List Item 5'),
    new ContextItem('List Item 6')
);

childMenu.add(
    new ContextItem('List Item 1'),
    new ContextItem('List Item 2'),
    new ContextItem('List Item 3')
);