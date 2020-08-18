import { ContextMenu } from "..";

if (typeof document !== 'undefined') {
    const win = document.defaultView as any;
    // Polyfill custom event
    if (typeof win.CustomEvent === 'undefined') {
        class CustomEvent<T> {
            constructor(event: string, params?: CustomEventInit<T>) {
                params = params || { bubbles: false, cancelable: false, detail: undefined };
                const evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles as boolean, params.cancelable as boolean, params.detail);
                return evt;
            }
        }
        CustomEvent.prototype = win.Event.prototype;
        win.CustomEvent = CustomEvent as any;
    }
}

export class Beacon<T extends HTMLElement> {
    #parentThis: ContextMenu<T>;
    #root: Document | undefined;
    #beaconEvent = 'closecontextmenu';
    #resolver?: (value: boolean) => void;
    constructor(parentThis: ContextMenu<T>) {
        this.#parentThis = parentThis;
        if (typeof document !== 'undefined') {
            this.#root = document;
        }
    }

    emit(): void {
        if (this.#root) {
            const contextMenuClose = new CustomEvent(this.#beaconEvent, {
                cancelable: true,
                bubbles: true,
                detail: {
                    originContext: this.#parentThis
                }
            });
            this.#root.dispatchEvent(contextMenuClose);
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
        this.#root?.addEventListener(this.#beaconEvent, this.#beaconListener);
    }

    off(): void {
        this.#root?.removeEventListener(this.#beaconEvent, this.#beaconListener);
        this.#resolver = undefined;
    }
}