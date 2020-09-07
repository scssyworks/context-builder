import { Select } from "../Select";
declare type ContextMenuCallback<U extends Event> = (event: U, ...args: any[]) => void;
declare type ContextMenuClickCallback<U extends Event> = (event: U, target: Select, ...args: any[]) => boolean | Promise<boolean> | void;
declare type ContextMenuActivateCallback = (rootEl: Select, ...args: any[]) => void;
declare type ContextMenuDeactivateCallback = (rootEl: Select, cb: (...args: any[]) => void, ...args: any[]) => void;
declare type ContextMenuClosedCallback = (...args: any) => void;
declare type ContextMenuGenericCallback = () => void;
export interface ContextMenuEventMap<T extends Event> {
    contextmenu: ContextMenuCallback<T>;
    click: ContextMenuClickCallback<T>;
    activate: ContextMenuActivateCallback;
    deactivate: ContextMenuDeactivateCallback;
    closed: ContextMenuClosedCallback;
    beforecleanup: ContextMenuGenericCallback;
    cleaned: ContextMenuGenericCallback;
}
export declare type ContextMenuHandler<T extends Event, K extends keyof ContextMenuEventMap<T>> = {
    type: K;
    handler: ContextMenuEventMap<T>[K];
};
export declare class EventEmitter<U extends Event> {
    #private;
    constructor(thisRef: Select);
    on<K extends keyof ContextMenuEventMap<U>>(type: K, handler: ContextMenuEventMap<U>[K]): void;
    off<K extends keyof ContextMenuEventMap<U>>(targetType?: K, targetHandler?: ContextMenuEventMap<U>[K]): void;
    emit<K extends keyof ContextMenuEventMap<U>>(type: K, ...args: any[]): any[];
    hasListener<K extends keyof ContextMenuEventMap<U>>(type: K): boolean;
}
export {};
//# sourceMappingURL=index.d.ts.map