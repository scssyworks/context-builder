import { ContextMenu, ContextItem } from '../src';

const menu = new ContextMenu()
    .on('activate', (rootEl) => {
        rootEl.map(el => {
            if (el instanceof HTMLElement) {
                el.classList.add('show')
            }
        });
    })
    .on('deactivate', (rootEl, fn) => {
        rootEl.once('transitionend', fn);
        rootEl.map(el => {
            if (el instanceof HTMLElement) {
                el.classList.remove('show');
            }
        });
    });

menu.add(
    new ContextItem('List Item 1'),
    new ContextItem('List Item 2'),
    new ContextItem('List Item 3'),
    new ContextItem('List Item 4'),
    new ContextItem('List Item 5'),
    new ContextItem('List Item 6')
);