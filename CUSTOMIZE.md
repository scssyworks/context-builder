# Using existing HTML to build context menu

You can use an existing DOM node as a reference to context menu.

```html
<ul class="context-menu">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
    <li>Item 4</li>
</ul>
```

```js
import { ContextMenu } from '@scssyworks/context-builder';

new ContextMenu(null, {
    rootElement: document.querySelector('.context-menu')
});
```

Existing DOM structure can readily be used as a context menu. However, you can add and customize elements at runtime.

# Adding custom menu items dynamically

```js
import { ContextMenu, ContextItem } from '@scssyworks/context-builder';

const contextMenu = new ContextMenu(null, {
    rootElement: document.querySelector('.context-menu')
});
contextMenu.add(
    new ContextItem('Item 5', {
        rootElement: document.createElement('li')
    });
);
```

You can also insert a nested list to existing menu:

```js
import { ContextMenu, ContextItem, ContextList } from '@scssyworks/context-builder';

const contextMenu = new ContextMenu(null, {
    rootElement: document.querySelector('.context-menu')
});
contextMenu.add(
    new ContextItem('Item 5', {
        rootElement: document.createElement('li')
    });
    (new ContextList('Item 6', {
        rootElement: document.createElement('li'),
        listElement: document.createElement('ul') // This list will be used to insert nested li items
    })).add(
        new ContextItem('Child Item 1', {
            rootElement: document.createElement('li')
        })
    )
);
```