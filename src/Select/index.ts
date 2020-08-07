import { Selector, TypeNodes } from "../types";

export type HTMLSelector = Select | Selector;
export type HTMLTypeNodes = Select | TypeNodes;

export class Select {
    body: boolean | HTMLBodyElement;
    elements: Node[];
    parent: Select | null;
    constructor(selector?: HTMLSelector) {
        // Check if document and document.body exist
        this.body = typeof document !== 'undefined' && !!document && (document.body as HTMLBodyElement);
        // Resolve references
        this.elements = [];
        if (this.body && selector) {
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
        this.parent = this.getParentSelection();
    }
    /**
     * Returns a Select object for parent nodes
     */
    getParentSelection(): (Select | null) {
        const parentNodeList = this.elements.map(el => el.parentNode).filter(el => !!el);
        if (parentNodeList.length) {
            return new Select(parentNodeList as Node[]);
        }
        return null;
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
        if (this.body) {
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
        if (this.body) {
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
        if (this.body) {
            const fragment = document.createDocumentFragment();
            this.elements.forEach(el => {
                fragment.appendChild(el);
            });
            return new Select(fragment);
        }
        return this;
    }
    /**
     * Clears current elements inner HTML
     */
    clear(): Select {
        if (this.body) {
            this.elements.forEach(el => {
                if (el instanceof HTMLElement) {
                    el.innerHTML = '';
                }
            });
        }
        return this;
    }
    /**
     * Returns current map of HTML strings
     */
    htmlMap(): string[] {
        return this.map((el: any) => {
            if (el instanceof HTMLElement) {
                return el.innerHTML;
            }
            return '';
        });
    }
    /**
     * Returns current map of text strings
     */
    textMap(): string[] {
        return this.map(el => {
            if (el instanceof HTMLElement) {
                return el.textContent || el.innerText;
            }
            return '';
        });
    }
    /**
     * Returns current list of element as array
     * @param {Function} evaluatorFn Evaluator function
     */
    map(evaluatorFn: (n: Node, i: number) => any): any[] {
        if (!this.body || typeof evaluatorFn !== 'function') {
            return this.elements;
        }
        return this.elements.map(evaluatorFn);
    }
    /**
     * Returns current body tag as a Select instance
     */
    getBodyTag(): Select {
        return new Select(this.body as HTMLBodyElement);
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
    on<K extends keyof WindowEventMap>(eventType: K, cb: (e: WindowEventMap[K]) => any, useCapture?: boolean): Select {
        this.elements.forEach(el => {
            el.addEventListener(eventType, cb as EventListener, useCapture);
        });
        return this;
    }
    /**
     * Removes a regular event listener
     */
    off<K extends keyof WindowEventMap>(eventType: K, cb: (e: WindowEventMap[K]) => any, useCapture?: boolean): Select {
        this.elements.forEach(el => {
            el.removeEventListener(eventType, cb as EventListener, useCapture);
        });
        return this;
    }
    /**
     * Auto detach event listener after first call
     * @param {string} eventType Event name
     * @param {Function} cb Callback function
     * @param {boolean} useCapture Use capture mode
     */
    once<K extends keyof WindowEventMap>(eventType: K, cb: (e: WindowEventMap[K]) => any, useCapture?: boolean): Select {
        const ref = this;
        const onceCb = function (e: WindowEventMap[K]) {
            cb.apply(this, [e]);
            ref.elements.forEach(el => {
                el.removeEventListener(eventType, onceCb, useCapture);
            });
        } as EventListener;
        this.elements.forEach(el => {
            el.addEventListener(eventType, onceCb, useCapture);
        });
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
     */
    setAttr(obj: { [prop: string]: any }): Select {
        this.elements.forEach(el => {
            if (el instanceof HTMLElement) {
                Object.keys(obj).forEach(attr => {
                    el.setAttribute(attr, obj[attr]);
                });
            }
        });
        return this;
    }
    /**
     * Returns a map of attribute values for selected elements
     * @param {string} attr Attribute
     */
    getAttrMap(attr: string): string[] {
        return this.map(el => {
            if (el instanceof HTMLElement) {
                return el.getAttribute(attr);
            }
            return undefined;
        });
    }
    /**
     * Enforce a repaint of targeted elements
     */
    repaint(): Select {
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
     * Static method to create a new HTML node
     * @param {string | Node | NodeList | HTMLCollection | Node[] | Select} nodes
     */
    static create(nodes: HTMLTypeNodes): Select {
        return (new Select(document.createDocumentFragment()))
            .append(nodes)
            .children();
    }
}