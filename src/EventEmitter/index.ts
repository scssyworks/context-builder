import { Select } from "../Select";

type ContextMenuCallback<U extends Event> = (event: U, ...args: any[]) => void;

type ContextMenuClickCallback<U extends Event> = (event: U, target: Select, ...args: any[]) => boolean | Promise<boolean> | void;

type ContextMenuActivateCallback = (rootEl: Select, ...args: any[]) => void;

type ContextMenuDeactivateCallback = (rootEl: Select, cb: (...args: any[]) => void, ...args: any[]) => void;

type ContextMenuClosedCallback = (...args: any) => void;

type ContextMenuGenericCallback = () => void;

export interface ContextMenuEventMap<T extends Event> {
    contextmenu: ContextMenuCallback<T>;
    click: ContextMenuClickCallback<T>;
    activate: ContextMenuActivateCallback;
    deactivate: ContextMenuDeactivateCallback;
    closed: ContextMenuClosedCallback;
    beforecleanup: ContextMenuGenericCallback;
    cleaned: ContextMenuGenericCallback;
}

export type ContextMenuHandler<T extends Event, K extends keyof ContextMenuEventMap<T>> = {
    type: K,
    handler: ContextMenuEventMap<T>[K];
};

export class EventEmitter<U extends Event> {
    #ref: Select;
    #handlers = [] as ContextMenuHandler<U, keyof ContextMenuEventMap<U>>[];
    constructor(thisRef: Select) {
        this.#ref = thisRef;
    }
    on<K extends keyof ContextMenuEventMap<U>>(type: K, handler: ContextMenuEventMap<U>[K]): void {
        this.#handlers.push({
            type,
            handler
        });
    }
    off<K extends keyof ContextMenuEventMap<U>>(targetType?: K, targetHandler?: ContextMenuEventMap<U>[K]): void {
        if (typeof targetType !== 'string') {
            this.#handlers.length = 0;
        } else {
            this.#handlers = this.#handlers.filter(({ type, handler }) => {
                return !(
                    type === targetType
                    && (typeof targetHandler === 'undefined' || handler === targetHandler)
                );
            });
        }
    }
    emit<K extends keyof ContextMenuEventMap<U>>(type: K, ...args: any[]): any[] {
        const returnedValues: any[] = [];
        this.#handlers.forEach(currEvent => {
            if (currEvent.type === type) {
                returnedValues.push((currEvent.handler as any).apply(this.#ref, args));
            }
        });
        return returnedValues;
    }
    hasListener<K extends keyof ContextMenuEventMap<U>>(type: K): boolean {
        return Boolean(this.#handlers.filter(evt => evt.type === type).length);
    }
}