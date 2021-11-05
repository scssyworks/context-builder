import { Select } from './Select';
import { CursorPlacement } from './CursorPlacement';
import { Beacon } from './Beacon';
import { EventEmitter, ContextMenuEventMap } from './EventEmitter';
import { isEnvBrowser, asyncResolve } from './helpers';

export interface ContextMenuConfig<T extends HTMLElement, U extends Event> {
  rootElement?: T;
  onClick?: (event: U) => boolean | void;
  onActivate?: (elements: Select) => void;
  onDeactivate?: (elements: Select, callback: () => void) => void;
  onContextMenu?: (event: U) => void;
  onBeforeCleanup?: () => boolean | Promise<boolean>;
}

export interface ContextListConfig<
  T extends HTMLElement,
  U extends HTMLElement
> {
  rootElement?: T;
  listElement?: U;
}

export interface ContextItemConfig<T extends HTMLElement> {
  rootElement?: T;
}

export class ContextMenu<T extends HTMLElement> {
  #open = false;
  #active = false;
  #doc?: Select;
  #beacon: Beacon<T>;
  #eventEmitter: EventEmitter<Event>;
  #body: Select;
  contextTarget: Select;
  isSupported: boolean;
  rootElement: Select;
  config: ContextMenuConfig<T, Event> = {};
  constructor(target?: string | null, config?: ContextMenuConfig<T, Event>) {
    this.#beacon = new Beacon(this);
    this.config = Object.freeze((typeof config === 'object' && config) || {});
    this.#body = new Select().getBodyTag();
    this.contextTarget =
      typeof target === 'string' ? new Select(target) : this.#body;
    this.contextTarget.setAttr(
      {
        'aria-haspopup': true,
        'aria-expanded': false,
      },
      true
    );
    this.isSupported = Boolean(this.contextTarget.elements.length);
    this.rootElement = Select.create(
      this.config.rootElement
        ? this.config.rootElement
        : `<ul class="context-menu-list"></ul>`
    )
      .setAttr({ 'data-cm-root': true })
      .on('click', this.#onRootClick);
    this.contextTarget
      .setAttr({ 'data-cm-host': true })
      .on('contextmenu', this.#onContextMenu);
    if (isEnvBrowser()) {
      this.#doc = new Select(document);
      this.#doc.on('click', this.#onClick);
    }
    this.#beacon.listen((shouldClose) => {
      if (shouldClose) {
        this.#onClick();
      }
    });
    this.#eventEmitter = new EventEmitter<Event>(this.rootElement);
  }
  // Private functions
  #exitFunction = (...args: any[]): void => {
    this.rootElement = this.rootElement.detach().children();
    this.#open = false;
    this.#active = false;
    this.contextTarget.setAttr(
      {
        'aria-expanded': false,
      },
      true
    );
    this.#eventEmitter.emit('closed', ...args);
  };
  #onClick = (): void => {
    if (this.#active) {
      if (
        typeof this.config.onDeactivate === 'function' ||
        this.#eventEmitter.hasListener('deactivate')
      ) {
        this.#open = true;
        if (this.config.onDeactivate) {
          this.config.onDeactivate(this.rootElement, this.#exitFunction);
        }
        this.#eventEmitter.emit(
          'deactivate',
          this.rootElement,
          this.#exitFunction
        );
      } else {
        this.#exitFunction();
      }
    }
  };
  #getReferenceTarget = (target: EventTarget | null): Select => {
    const currentTarget = new Select(target);
    return currentTarget
      .getAllParents()
      .add(currentTarget)
      .filter((el) => {
        return el instanceof HTMLElement && el.hasAttribute('data-cm-host');
      });
  };
  #onContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation(); // For nested context menus
    this.#beacon.emit(); // Sends notification to other context menu instances to automatically close
    this.#active = true;
    if (!this.#open) {
      this.#getReferenceTarget(e.target).setAttr(
        {
          'aria-expanded': true,
        },
        true
      );
      this.#body.append(this.rootElement);
      new CursorPlacement(e, this.rootElement);
      if (typeof this.config.onActivate === 'function') {
        this.rootElement.reflow();
        this.config.onActivate.apply(this.rootElement, [this.rootElement]);
      }
      if (typeof this.config.onContextMenu === 'function') {
        this.config.onContextMenu.apply(this.rootElement, [e]);
      }
      this.#eventEmitter.emit('activate', this.rootElement);
      this.#eventEmitter.emit('contextmenu', e);
    }
  };
  #onRootClick = async (e: Event): Promise<void> => {
    e.stopPropagation();
    if (
      typeof this.config.onClick === 'function' ||
      this.#eventEmitter.hasListener('click')
    ) {
      if (this.config.onClick) {
        if (
          await asyncResolve<boolean>(
            this.config.onClick.apply(new Select(e.target), [e])
          )
        ) {
          this.#onClick();
        }
      }
      this.#eventEmitter
        .emit('click', e, new Select(e.target))
        .forEach(
          async (shouldExit: boolean | Promise<boolean>): Promise<void> => {
            if (await asyncResolve<boolean>(shouldExit)) {
              this.#onClick();
            }
          }
        );
    }
  };
  #onBeforeCleanup = (
    cb: () => boolean | Promise<boolean>
  ): boolean | Promise<boolean> | void => {
    if (typeof cb === 'function') {
      const result = cb();
      return typeof result === 'undefined' || result;
    }
    return true;
  };
  #performCleanup = (): void => {
    this.contextTarget
      .off('contextmenu', this.#onContextMenu)
      .off('click', this.#onClick);
    this.rootElement.off('click', this.#onRootClick).remove();
    if (isEnvBrowser()) {
      this.#doc?.off('click', this.#onClick);
    }
    this.#beacon.off();
    this.#eventEmitter.emit('cleaned');
    this.#eventEmitter.off();
    this.#active = false;
    this.#open = false;
  };
  // Public methods
  add(
    ...args: (
      | ContextList<HTMLElement, HTMLElement>
      | ContextItem<HTMLElement>
    )[]
  ): ContextMenu<T> {
    const elements = [...args];
    for (const element of elements) {
      if (element instanceof ContextList || element instanceof ContextItem) {
        this.rootElement.append(element.rootElement);
      }
    }
    return this;
  }
  async cleanup(): Promise<void> {
    this.#eventEmitter.emit('beforecleanup');
    if (typeof this.config.onBeforeCleanup === 'function') {
      if (
        await asyncResolve<boolean>(
          this.#onBeforeCleanup(this.config.onBeforeCleanup)
        )
      ) {
        this.#performCleanup();
      }
    } else {
      this.#performCleanup();
    }
  }
  on<K extends keyof ContextMenuEventMap<Event>>(
    event: K,
    handler: ContextMenuEventMap<Event>[K]
  ): ContextMenu<T> {
    this.#eventEmitter.on(event, handler);
    return this;
  }
  off<K extends keyof ContextMenuEventMap<Event>>(
    event?: K,
    handler?: ContextMenuEventMap<Event>[K]
  ): ContextMenu<T> {
    this.#eventEmitter.off(event, handler);
    return this;
  }
}

// Generates a context list
export class ContextList<T extends HTMLElement, U extends HTMLElement> {
  config: ContextListConfig<T, U> = {};
  rootElement: Select;
  listElement: Select;
  constructor(title: string, config?: ContextListConfig<T, U>) {
    this.config = Object.freeze((typeof config === 'object' && config) || {});
    this.listElement = Select.create(
      this.config.listElement
        ? this.config.listElement
        : `<ul class="context-submenu"></ul>`
    ).setAttr({ 'data-cm-submenu-root': true });
    this.rootElement = Select.create(
      this.config.rootElement
        ? this.config.rootElement
        : `<li class="menu-item"></li>`
    )
      .setAttr({
        'data-sub-elements': true,
      })
      .append(title)
      .append(this.listElement);
  }
  get parent(): Select | null {
    return this.rootElement.parent;
  }
  add(
    ...args: (
      | ContextList<HTMLElement, HTMLElement>
      | ContextItem<HTMLElement>
    )[]
  ): ContextList<T, U> {
    const elements = [...args];
    for (const element of elements) {
      if (element instanceof ContextList || element instanceof ContextItem) {
        this.listElement.append(element.rootElement);
      }
    }
    return this;
  }
  remove(): void {
    this.rootElement.remove();
  }
}

// Generates a context item
export class ContextItem<T extends HTMLElement> {
  config: ContextItemConfig<T> = {};
  rootElement: Select;
  constructor(title: string, config?: ContextItemConfig<T>) {
    this.config = Object.freeze((typeof config === 'object' && config) || {});
    this.rootElement = Select.create(
      this.config.rootElement
        ? this.config.rootElement
        : `<li class="menu-item"></li>`
    )
      .setAttr({ 'data-cm-leaf': true })
      .append(title);
  }
  remove(): void {
    this.rootElement.remove();
  }
}
