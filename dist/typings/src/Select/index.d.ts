import { Selector, TypeNodes } from "../types";
export declare type HTMLSelector = Select | Selector;
export declare type HTMLTypeNodes = Select | TypeNodes;
export declare class Select {
    body: boolean | HTMLBodyElement;
    elements: Node[];
    parent: Select | null;
    constructor(selector?: HTMLSelector);
    getParentSelection(): (Select | null);
    query(selector: string): Select;
    append(nodes: HTMLTypeNodes): Select;
    prepend(nodes: HTMLTypeNodes): Select;
    detach(): Select;
    clear(): Select;
    htmlMap(): string[];
    textMap(): string[];
    map(evaluatorFn: (n: Node, i: number) => any): any[];
    getBodyTag(): Select;
    children(): Select;
    on<K extends keyof WindowEventMap>(eventType: K, cb: (e: WindowEventMap[K]) => any, useCapture?: boolean): Select;
    off<K extends keyof WindowEventMap>(eventType: K, cb: (e: WindowEventMap[K]) => any, useCapture?: boolean): Select;
    once<K extends keyof WindowEventMap>(eventType: K, cb: (e: WindowEventMap[K]) => any, useCapture?: boolean): Select;
    bounds(): (DOMRect | null)[];
    setCSSProps(obj: {
        [prop: string]: any;
    }): Select;
    setAttr(obj: {
        [prop: string]: any;
    }): Select;
    getAttrMap(attr: string): string[];
    repaint(): Select;
    contains(nodes: HTMLSelector): boolean;
    static create(nodes: HTMLTypeNodes): Select;
}
//# sourceMappingURL=index.d.ts.map