import { Select } from "./Select";
import { ContextMenuEventMap } from "./EventEmitter";
export interface ContextMenuConfig<T extends HTMLElement, U extends Event> {
    rootElement?: T;
    onClick?: (event: U) => boolean | void;
    onActivate?: (elements: Select) => void;
    onDeactivate?: (elements: Select, callback: () => void) => void;
    onContextMenu?: (event: U) => void;
    onBeforeCleanup?: () => (boolean | Promise<boolean>);
}
export interface ContextListConfig<T extends HTMLElement, U extends HTMLElement> {
    rootElement?: T;
    listElement?: U;
}
export interface ContextItemConfig<T extends HTMLElement> {
    rootElement?: T;
}
export declare class ContextMenu<T extends HTMLElement> {
    #private;
    contextTarget: Select;
    isSupported: boolean;
    rootElement: Select;
    config: ContextMenuConfig<T, Event>;
    constructor(target?: string | null, config?: ContextMenuConfig<T, Event>);
    add(...args: (ContextList<HTMLElement, HTMLElement> | ContextItem<HTMLElement>)[]): ContextMenu<T>;
    cleanup(): Promise<void>;
    on<K extends keyof ContextMenuEventMap<Event>>(event: K, handler: ContextMenuEventMap<Event>[K]): ContextMenu<T>;
    off<K extends keyof ContextMenuEventMap<Event>>(event?: K, handler?: ContextMenuEventMap<Event>[K]): ContextMenu<T>;
}
export declare class ContextList<T extends HTMLElement, U extends HTMLElement> {
    config: ContextListConfig<T, U>;
    rootElement: Select;
    listElement: Select;
    constructor(title: string, config?: ContextListConfig<T, U>);
    get parent(): (Select | null);
    add(...args: (ContextList<HTMLElement, HTMLElement> | ContextItem<HTMLElement>)[]): ContextList<T, U>;
    remove(): void;
}
export declare class ContextItem<T extends HTMLElement> {
    config: ContextItemConfig<T>;
    rootElement: Select;
    constructor(title: string, config?: ContextItemConfig<T>);
    remove(): void;
}
//# sourceMappingURL=index.d.ts.map