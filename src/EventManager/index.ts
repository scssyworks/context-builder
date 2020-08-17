import { Select } from "../Select";

type ContextMenuCallback<U extends Event> = (event: U, ...args: any[]) => void;

type ContextMenuClickCallback<U extends Event> = (event: U, target: Select, ...args: any[]) => boolean | void;

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


export class EventManager<U extends Event> {
    #ref: Select;
    #handlers = [] as ContextMenuHandler<U, keyof ContextMenuEventMap<U>>[];
    constructor(thisRef: Select) {
        this.#ref = thisRef;
    }
    #existingEvents = (handler: unknown): ContextMenuHandler<U, keyof ContextMenuEventMap<U>>[] => {
        return this.#handlers.filter(evtObj => evtObj.handler === handler);
    }
    on<K extends keyof ContextMenuEventMap<U>>(type: K, handler: ContextMenuEventMap<U>[K]): void {
        const currEvents = this.#existingEvents(handler);
        let pushEvent = true;
        for (const currEvent of currEvents) {
            if (currEvent.type === type) {
                pushEvent = false;
                break;
            }
        }
        if (pushEvent) {
            this.#handlers.push({
                type,
                handler
            });
        }
    }
    off<K extends keyof ContextMenuEventMap<U>>(type?: K, handler?: ContextMenuEventMap<U>[K]): void {
        if (typeof type !== 'string') {
            this.#handlers.length = 0;
        } else {
            const offHandlers = [];
            for (const currEvent of this.#handlers) {
                if ((currEvent.type === type) && (
                    typeof handler === 'undefined'
                    || currEvent.handler === handler
                )) {
                    offHandlers.push(currEvent);
                }
            }
            for (const handler of offHandlers) {
                this.#handlers.splice(this.#handlers.indexOf(handler), 1);
            }
        }
    }
    emit<K extends keyof ContextMenuEventMap<U>>(type: K, ...args: any[]): any[] {
        const returnedValues: any[] = [];
        this.#handlers.forEach(currEvent => {
            if (currEvent.type === type) {
                returnedValues.push((currEvent.handler as any).apply(this.#ref, args));
            }
        });
        console.log(this.#handlers);
        return returnedValues;
    }
    hasListener<K extends keyof ContextMenuEventMap<U>>(type: K): boolean {
        return Boolean(this.#handlers.filter(evt => evt.type === type).length);
    }
}