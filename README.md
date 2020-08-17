# Context Builder

A powerful and easy to use library for building custom context menus.

```sh
npm i @scssyworks/context-builder
```

# How does it work?

## Create a context menu instance for a given target.

```js
import { ContextMenu } from '@scssyworks/context-builder';

const contextMenu = new ContextMenu('div');
// ...
const contextMenu = new ContextMenu(); // For body element
```

If you don't specify a target selector, context menu is enabled for ``body`` element.

## Add context menu items

```js
import { ContextMenu, ContextItem } from '@scssyworks/context-builder';

const contextMenu = new ContextMenu('div');
contextMenu.add(
    new ContextItem('Option 1'),
    new ContextItem('Option 2'),
    // ...
);
```

## Add nested menu items

```js
import { ContextMenu, ContextItem, ContextList } from '@scssyworks/context-builder';

const contextMenu = new ContextMenu('div');
contextMenu.add(
    new ContextItem('Option 1'),
    new ContextItem('Option 2'),
    (new ContextList('Option 3')).add(
        new ContextItem('Child Option 1')
    )
    // ...
);
```

Context builder supports nesting of elements up to ``nth`` level.

## Listen to click events

```js
import { ContextMenu, ContextItem, ContextList } from '@scssyworks/context-builder';

const contextMenu = new ContextMenu('div', {
    onClick(event) {
        // Use event.target to get the target element
        // ...
        return true; // Return true to automatically close the menu
    }
});
// ...
```

## Listen to activate and deactivate events

Activate and Deactivate listeners are great for adding entry and exit transitions

```js
import { ContextMenu, ContextItem, ContextList } from '@scssyworks/context-builder';

const contextMenu = new ContextMenu('div', {
    onActivate(elements) {
        elements.map(el => {
            el.classList.add('show'); // Adding "show" class adds an entry transition
        });
    },
    onDeactivate(elements, callback) {
        elements.once('transitionend', callback); // Callback function is "required" to complete the exit transition
        elements.map(el => {
            el.classList.remove('show'); // Removing "show" class triggers an exit transition
        });
    }
});
// ...
```

## Listen to "contextmenu" event

You can listen to original contextmenu event if you want to capture text selection or do more stuff.

```js
import { ContextMenu, ContextItem, ContextList } from '@scssyworks/context-builder';

const contextMenu = new ContextMenu('div', {
    onContextMenu(event) {
        console.log(event);
    }
});
// ...
```

## Destroy context menu

```js
contextMenu.cleanup();
```

# Customize

Context Builder is fully customizable. You can use your own elements to build context menu. Use the following guide to customize your context menus:

https://github.com/scssyworks/context-builder/blob/master/CUSTOMIZE.md