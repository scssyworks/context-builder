/**
 * Place your jest test cases here
 */

import { ContextMenu, ContextItem, ContextList } from './src';

describe('ContextMenu', () => {
  let contextMenu: ContextMenu<HTMLElement>;
  let onClick: jest.Mock;
  let onActivate: jest.Mock;
  let onDeactivate: jest.Mock;
  let onContextMenu: jest.Mock;
  let onBeforeCleanup: jest.Mock;
  beforeEach(() => {
    onClick = jest.fn(() => true);
    onActivate = jest.fn();
    onDeactivate = jest.fn((_: any, cb: () => void) => {
      cb();
      document.body.dispatchEvent(new Event('ondeactivateevent'));
    });
    onContextMenu = jest.fn();
    onBeforeCleanup = jest.fn();
    contextMenu = new ContextMenu(null, {
      onClick,
      onActivate,
      onDeactivate,
      onContextMenu,
      onBeforeCleanup,
    });
    contextMenu.add(
      new ContextItem('Item'),
      new ContextList('List').add(new ContextItem('Inner Item'))
    );
  });
  afterEach(() => {
    contextMenu.cleanup();
    onClick.mockClear();
    onActivate.mockClear();
    onDeactivate.mockClear();
    onContextMenu.mockClear();
    onBeforeCleanup.mockClear();
    document.body.innerHTML = '';
  });
  it('should instantiate', () => {
    expect(contextMenu.isSupported).toBeTruthy();
  });
  it('should initiate context menu on right click', () => {
    document.body.dispatchEvent(new Event('contextmenu'));
    const cmRoot = document.querySelector('[data-cm-root]');
    expect(cmRoot).toBeTruthy();
  });
  it('should NOT initiate context menu twice on right click', () => {
    document.body.dispatchEvent(new Event('contextmenu'));
    document.body.dispatchEvent(new Event('contextmenu'));
    const cmRoot = document.querySelectorAll('[data-cm-root]');
    expect(cmRoot.length).toBe(1);
  });
  it('should remove context menu if body element receives a click event', () => {
    document.body.dispatchEvent(new Event('contextmenu'));
    let cmRoot = document.querySelector('[data-cm-root]');
    expect(cmRoot).toBeTruthy();
    document.body.click();
    expect(onDeactivate).toHaveBeenCalled();
  });
  it('should receive click event if element inside context menu is clicked', () => {
    document.body.dispatchEvent(new Event('contextmenu'));
    let cmRoot = document.querySelector('[data-cm-root]');
    cmRoot?.querySelector('li')?.click();
    expect(onClick).toHaveBeenCalled();
  });
  it('should close context menu on inner element click if "onClick" handler returns true', () => {
    const testPromise = new Promise<void>((resolve) => {
      document.body.addEventListener('ondeactivateevent', () => {
        const cmRoot = document.querySelectorAll('[data-cm-root]');
        expect(cmRoot.length).toBe(0);
        resolve();
      });
    });
    document.body.dispatchEvent(new Event('contextmenu'));
    document.querySelector('li')?.click();
    return testPromise;
  });
  it('should allow listening to context menu lifecycle events via "on" method', () => {
    const onContextMenuMock = jest.fn();
    contextMenu.on('contextmenu', onContextMenuMock);
    document.body.dispatchEvent(new Event('contextmenu'));
    expect(onContextMenuMock).toHaveBeenCalled();
  });
  it('should allow to turning off lifecycle events via "off" method', () => {
    const onContextMenuMock = jest.fn();
    contextMenu.on('contextmenu', onContextMenuMock);
    contextMenu.off('contextmenu', onContextMenuMock);
    document.body.dispatchEvent(new Event('contextmenu'));
    expect(onContextMenuMock).not.toHaveBeenCalled();
  });
  it('should allow attaching multiple events via "on" method', () => {
    const onContextMenuMock = jest.fn();
    const onContextMenuMock2 = jest.fn();
    contextMenu.on('contextmenu', onContextMenuMock);
    contextMenu.on('contextmenu', onContextMenuMock2);
    document.body.dispatchEvent(new Event('contextmenu'));
    expect(onContextMenuMock).toHaveBeenCalled();
    expect(onContextMenuMock2).toHaveBeenCalled();
  });
  it('should turn off all events handlers for given event if callback is not passed', () => {
    const onContextMenuMock = jest.fn();
    const onContextMenuMock2 = jest.fn();
    contextMenu.on('contextmenu', onContextMenuMock);
    contextMenu.on('contextmenu', onContextMenuMock2);
    contextMenu.off('contextmenu');
    document.body.dispatchEvent(new Event('contextmenu'));
    expect(onContextMenuMock).not.toHaveBeenCalled();
    expect(onContextMenuMock2).not.toHaveBeenCalled();
  });
  it('should close context menu on body click if "on" click handler is used', () => {
    const onActivateMock = jest.fn();
    const onDeactivateMock = jest.fn((_: any, cb: () => void) => {
      cb();
      const cmRoot = document.querySelectorAll('[data-cm-root]');
      expect(cmRoot.length).toBe(0);
    });
    contextMenu.on('activate', onActivateMock);
    contextMenu.on('deactivate', onDeactivateMock);
    document.body.dispatchEvent(new Event('contextmenu'));
    expect(onActivateMock).toHaveBeenCalled();
    document.body.click();
  });
});
