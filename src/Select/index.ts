import { Selector, TypeNodes } from "../types";
import { isEnvBrowser } from "../helpers";

export type HTMLSelector = Select | Selector;
export type HTMLTypeNodes = Select | TypeNodes;

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

export class Select {
    #body?: HTMLBodyElement;
    elements: Node[];
    parent: Select | null;
    constructor(selector?: HTMLSelector) {
        // Check if document and document.body exist
        if (isEnvBrowser()) {
            this.#body = document.body as HTMLBodyElement;
        }
        // Resolve references
        this.elements = [];
        if (this.#body && selector) {
            if (typeof selector === 'string') {
                this.elements = [...document.querySelectorAll(selector)] as Node[];
            } else if (selector instanceof Node || selector instanceof EventTarget) {
                this.elements = [selector] as Node[];
            } else if (
                selector instanceof NodeList
                || selector instanceof HTMLCollection
            ) {
                this.elements = [...selector] as Node[];
            } else if (Object.prototype.hasOwnProperty.call(selector, 'length')) { // For jQuery or jQuery like objects
                for (let i = 0; i < (selector as Node[]).length; i++) {
                    this.elements.push((selector as Node[])[i]);
                }
            } else if (selector instanceof Select) {
                this.elements = [...selector.elements] as Node[];
                this.parent = selector.parent;
            }
        }
        // Resolve parent
        this.parent = this.getParentNode();
    }
    /**
     * Returns a Select object for parent nodes
     */
    getParentNode(): (Select | null) {
        const parentNodeList = this.elements.map(el => el.parentNode).filter(el => !!el);
        if (parentNodeList.length) {
            return new Select(parentNodeList as Node[]);
        }
        return null;
    }
    /**
     * Returns a Select object for all parents
     */
    getAllParents(): Select {
        let currRef: (Select | null) = new Select(this);
        const parentsList = new Select();
        do {
            currRef = currRef.getParentNode();
            if (currRef) {
                parentsList.add(currRef);
            }
        } while (currRef);
        return parentsList;
    }
    /**
     * Query children of current element
     * @param {string} selector Selector
     */
    query(selector: string): Select {
        const selected = [] as Node[];
        this.elements.forEach(el => {
            if (el instanceof HTMLElement) {
                const children = [...el.querySelectorAll(selector)] as HTMLElement[];
                children.forEach(child => {
                    if (selected.indexOf(child) === -1) {
                        selected.push(child);
                    }
                });
            }
        });
        return new Select(selected);
    }
    /**
     * Appends HTML body to current element(s)
     * @param {string | Node | NodeList | HTMLCollection | Node[] | Select} nodes 
     */
    append(nodes: HTMLTypeNodes): Select {
        if (this.#body) {
            let consumableNodes: Select;
            if (typeof nodes === 'string') {
                // Expecting a plain HTML string
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = nodes;
                consumableNodes = new Select(tempDiv.childNodes);
            } else {
                // For everything else treat them as regular nodes
                consumableNodes = new Select(nodes);
            }
            this.elements.forEach((target, i) => {
                if (consumableNodes.elements.length === 1) {
                    target.appendChild(consumableNodes.elements[0]); // Keeping intact the original reference
                } else {
                    const fragment = document.createDocumentFragment();
                    consumableNodes.elements.forEach(n => {
                        fragment.appendChild(i === 0 ? n : n.cloneNode());
                    });
                    target.appendChild(fragment);
                }
            });
        }
        return this;
    }
    /**
     * Prepends HTML body to current element(s)
     * @param {string | Node | NodeList | HTMLCollection | Node[] | Select} nodes
     */
    prepend(nodes: HTMLTypeNodes): Select {
        if (this.#body) {
            this.elements.forEach(target => {
                const currentFragment = (new Select(target.childNodes)).detach();
                (new Select(target)).append(nodes).append(currentFragment);
            });
        }
        return this;
    }
    /**
     * Removes current set of elements from DOM and return DocumentFragment as a Select instance
     */
    detach(): Select {
        if (this.#body) {
            const fragment = document.createDocumentFragment();
            this.elements.forEach(el => {
                fragment.appendChild(el);
            });
            return new Select(fragment);
        }
        return this;
    }
    /**
     * Returns current list of element as array
     * @param {Function} evaluatorFn Evaluator function
     */
    map(evaluatorFn: (n: Node, i: number) => any): any[] {
        if (!this.#body || typeof evaluatorFn !== 'function') {
            return this.elements;
        }
        return this.elements.map(evaluatorFn);
    }
    /**
     * Filter elements based on returned condition
     * @param {Function} evaluatorFn Evaluator function
     */
    filter(evaluatorFn: (n: Node, i: number) => boolean): Select {
        const matched = [] as Node[];
        this.map((el, i) => {
            if (evaluatorFn(el, i)) {
                matched.push(el);
            }
        });
        return new Select(matched);
    }
    /**
     * Merges passed selection to current object
     * @param {Select} selection input selection
     */
    add(selection: Select): Select {
        this.elements.push(...selection.elements);
        return this;
    }
    /**
     * Returns current body tag as a Select instance
     */
    getBodyTag(): Select {
        return new Select(this.#body as HTMLBodyElement);
    }
    /**
     * Returns current Select reference children
     */
    children(): Select {
        const elements = [] as Node[];
        this.elements.forEach(el => {
            [...el.childNodes].forEach(n => {
                if (elements.indexOf(n) === -1) {
                    elements.push(n);
                }
            });
        });
        return new Select(elements);
    }
    /**
     * Binds a regular event listener
     */
    on(eventType: string, cb: (e: any) => any, useCapture?: boolean): Select {
        this.elements.forEach(el => {
            el.addEventListener(`${eventType}`, cb, useCapture);
        });
        return this;
    }
    /**
     * Removes a regular event listener
     */
    off(eventType: string, cb: (e: any) => any, useCapture?: boolean): Select {
        this.elements.forEach(el => {
            el.removeEventListener(eventType, cb, useCapture);
        });
        return this;
    }
    /**
     * Auto detach event listener after first call
     * @param {string} eventType Event name
     * @param {Function} cb Callback function
     * @param {boolean} useCapture Use capture mode
     */
    once(eventType: string, cb: (e: any) => any, useCapture?: boolean): Select {
        const ref = this;
        const onceCb = function (e: any) {
            cb.apply(this, [e]);
            ref.off(eventType, onceCb, useCapture);
        };
        this.on(eventType, onceCb, useCapture);
        return this;
    }
    /**
     * Returns map of DOMRect objects
     */
    bounds(): (DOMRect | null)[] {
        return this.map(el => {
            if (el instanceof HTMLElement) {
                return el.getBoundingClientRect();
            }
            return null;
        });
    }
    /**
     * Sets CSS properties to element(s)
     * @param {object} obj CSS properties
     */
    setCSSProps(obj: { [prop: string]: any }): Select {
        this.elements.forEach(el => {
            if (el instanceof HTMLElement) {
                Object.keys(obj).forEach((prop: any) => {
                    el.style[prop] = obj[prop];
                });
            }
        });
        return this;
    }
    /**
     * Sets HTML element attributes
     * @param {object} obj HTML element attributes
     * @param {boolean} polite Flag to set attributes politely
     */
    setAttr(
        obj: {
            [prop: string]: string | number | boolean | null | undefined
        },
        polite = false
    ): Select {
        this.elements.forEach(el => {
            if (el instanceof HTMLElement) {
                Object.keys(obj).forEach(attr => {
                    if (
                        !polite
                        || (polite && el.hasAttribute(attr))
                    ) {
                        el.setAttribute(attr, `${obj[attr]}`);
                    }
                });
            }
        });
        return this;
    }
    /**
     * Enforce a repaint of targeted elements
     */
    reflow(): Select {
        this.elements.forEach(el => {
            if (el instanceof HTMLElement) {
                el.offsetHeight; // Accessing offset height somehow triggers a reflow
            }
        });
        return this;
    }
    /**
     * Returns true if current element is contained in this selector
     * @param {Node | NodeList | HTMLCollection | Select} nodes Element
     */
    contains(nodes: HTMLSelector): boolean {
        return (new Select(nodes)).map(n => {
            for (const el of this.elements) {
                if (el.contains(n)) {
                    return true;
                }
            }
            return false;
        }).indexOf(false) === -1;
    }
    /**
     * Removes the current element from DOM entirely
     */
    remove(): Select {
        this.elements.forEach(el => {
            el.parentNode?.removeChild(el);
        });
        return this;
    }
    /**
     * Emits a browser event
     * @param {string} eventName Event name
     * @param {any[]} args Parameters
     */
    emit(eventName: string, ...args: any[]): Select {
        const customEvent = new CustomEvent(eventName, {
            cancelable: true,
            bubbles: true,
            detail: {
                args
            }
        });
        this.elements.forEach(el => {
            el.dispatchEvent(customEvent);
        });
        return this;
    }
    /**
     * Static method to create a new HTML node
     * @param {string | Node | NodeList | HTMLCollection | Node[] | Select} nodes
     */
    static create(nodes: HTMLTypeNodes): Select {
        if (nodes instanceof HTMLTemplateElement) {
            return new Select(nodes.content).children(); // Content is a fragment itself
        }
        return (new Select(document.createDocumentFragment()))
            .append(nodes)
            .children();
    }
}