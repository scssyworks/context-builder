export class Select {
    constructor(selector) {
        // Check if document and document.body exist
        this.body = typeof document !== 'undefined' && document && document.body;
        // Resolve references
        this.elements = [];
        if (this.body && selector) {
            if (typeof selector === 'string') {
                this.elements = [...document.querySelectorAll(selector)];
            } else if (selector instanceof Node) {
                this.elements = [selector];
            } else if (
                selector instanceof NodeList
                || selector instanceof HTMLCollection
            ) {
                this.elements = [...selector];
            } else if (Object.prototype.hasOwnProperty.call(selector, 'length')) { // For jQuery or jQuery like objects
                for (let i = 0; i < selector.length; i++) {
                    this.elements.push(selector[i]);
                }
            } else if (selector instanceof Select) {
                this.elements = [...selector.elements];
                this.parent = selector.parent;
            }
        }
        // Resolve parent
        this.parent = this.getParentSelection();
    }
    /**
     * Returns a Select object for parent nodes
     */
    getParentSelection() {
        const parentNodeList = this.elements.map(el => el.parentNode).filter(el => !!el);
        if (parentNodeList.length) {
            return new Select(parentNodeList);
        }
        return null;
    }
    /**
     * Query children of current element
     * @param {string} selector Selector
     */
    query(selector) {
        const selected = [];
        this.elements.forEach(el => {
            const children = [...el.querySelectorAll(selector)];
            children.forEach(child => {
                if (selected.indexOf(child) === -1) {
                    selected.push(children);
                }
            });
        });
        return new Select(selected);
    }
    /**
     * Appends HTML body to current element(s)
     * @param {string | Node | NodeList | HTMLCollection | Node[] | Select} nodes 
     */
    append(nodes) {
        if (this.body) {
            let consumableNodes;
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
    prepend(nodes) {
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
    detach() {
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
    clear() {
        if (this.body) {
            this.elements.forEach(el => {
                el.innerHTML = '';
            });
        }
        return this;
    }
    /**
     * Returns current map of HTML strings
     */
    htmlMap() {
        return this.map(el => el.innerHTML);
    }
    /**
     * Returns current map of text strings
     */
    textMap() {
        return this.map(el => el.textContent || el.innerText);
    }
    /**
     * Returns current list of element as array
     * @param {Function} evaluatorFn Evaluator function
     */
    map(evaluatorFn) {
        if (!this.body || typeof evaluatorFn !== 'function') {
            return this.elements;
        }
        return this.elements.map(evaluatorFn);
    }
    /**
     * Returns current body tag as a Select instance
     */
    getBodyTag() {
        return new Select(this.body);
    }
    /**
     * Returns current Select reference children
     */
    children() {
        const elements = [];
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
    on() {
        this.elements.forEach(el => {
            el.addEventListener(...arguments);
        });
        return this;
    }
    /**
     * Removes a regular event listener
     */
    off() {
        this.elements.forEach(el => {
            el.removeEventListener(...arguments);
        });
        return this;
    }
    /**
     * Returns map of DOMRect objects
     */
    bounds() {
        return this.map(el => el.getBoundingClientRect());
    }
    /**
     * Sets CSS properties to element(s)
     * @param {object} obj CSS properties
     */
    setCSSProps(obj) {
        this.elements.forEach(el => {
            Object.keys(obj).forEach(prop => {
                el.style[prop] = obj[prop];
            });
        });
        return this;
    }
    /**
     * Sets HTML element attributes
     * @param {object} obj HTML element attributes
     */
    setAttr(obj) {
        this.elements.forEach(el => {
            Object.keys(obj).forEach(attr => {
                el.setAttribute(attr, obj[attr]);
            });
        });
        return this;
    }
    /**
     * Returns a map of attribute values for selected elements
     * @param {string} attr Attribute
     */
    getAttrMap(attr) {
        return this.map(el => el.getAttribute(attr));
    }
    /**
     * Enforce a repaint of targeted elements
     */
    repaint() {
        this.elements.forEach(el => {
            el.offsetHeight; // Accessing offset height somehow triggers a reflow
        });
        return this;
    }
    /**
     * Returns true if current element is contained in this selector
     * @param {Node | NodeList | HTMLCollection | Select} nodes Element
     */
    contains(nodes) {
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
    static create(nodes) {
        return (new Select(document.createDocumentFragment()))
            .append(nodes)
            .children();
    }
}