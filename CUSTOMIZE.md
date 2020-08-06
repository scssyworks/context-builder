# Using existing HTML to build context menu

You can use an existing DOM structure as context menu. You need to pass it as ``rootElement`` reference.

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

# Adding custom menu items dynamically

You can customize menu elements at any level. Context Builder gives full flexibility to alter and modify menus as per your requirements.

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