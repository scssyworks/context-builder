import { ContextMenu, ContextItem } from '../src';

const menu = new ContextMenu(null, {
    onClick() {
        console.log(this.textMap());
        return true;
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