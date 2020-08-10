import { ContextMenu } from "..";

if (typeof window !== 'undefined') {
    // Polyfill custom event
    if (typeof window.CustomEvent === 'undefined') {
        class CustomEvent<T> {
            constructor(event: string, params?: CustomEventInit<T>) {
                params = params || { bubbles: false, cancelable: false, detail: undefined };
                const evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles as boolean, params.cancelable as boolean, params.detail);
                return evt;
            }
        }
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent as any;
    }
}

export class Beacon<T extends HTMLElement> {
    #parentThis: ContextMenu<T>;
    #body: HTMLElement | undefined;
    #beaconEvent = 'closecontextmenu';
    #resolver?: (value: boolean) => void;
    constructor(parentThis: ContextMenu<T>) {
        this.#parentThis = parentThis;
        if (typeof document !== 'undefined') {
            this.#body = document.body;
        }
    }

    emit(): void {
        if (this.#body) {
            const contextMenuClose = new CustomEvent(this.#beaconEvent, {
                cancelable: true,
                bubbles: true,
                detail: {
                    originContext: this.#parentThis
                }
            });
            this.#body.dispatchEvent(contextMenuClose);
        }
    }

    #beaconListener = (e: Event): void => {
        const { originContext } = (e as CustomEvent).detail as { originContext: ContextMenu<T> };
        if (typeof this.#resolver === 'function') {
            this.#resolver(originContext !== this.#parentThis);
        }
    }

    listen(resolve: (value: boolean) => void): void {
        this.#resolver = resolve;
        this.#body?.addEventListener(this.#beaconEvent, this.#beaconListener);
    }

    off(): void {
        this.#body?.removeEventListener(this.#beaconEvent, this.#beaconListener);
        this.#resolver = undefined;
    }
}