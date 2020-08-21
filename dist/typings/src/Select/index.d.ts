import { Selector, TypeNodes } from "../types";
export declare type HTMLSelector = Select | Selector;
export declare type HTMLTypeNodes = Select | TypeNodes;
export declare class Select {
    #private;
    elements: Node[];
    parent: Select | null;
    constructor(selector?: HTMLSelector);
    getParentNode(): (Select | null);
    getAllParents(): Select;
    query(selector: string): Select;
    append(nodes: HTMLTypeNodes): Select;
    prepend(nodes: HTMLTypeNodes): Select;
    detach(): Select;
    empty(): Select;
    htmlMap(): string[];
    textMap(): string[];
    map(evaluatorFn: (n: Node, i: number) => any): any[];
    filter(evaluatorFn: (n: Node, i: number) => boolean): Select;
    add(selection: Select): Select;
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
        [prop: string]: string | number | boolean | null | undefined;
    }, polite?: boolean): Select;
    getAttrMap(attr: string): string[];
    reflow(): Select;
    contains(nodes: HTMLSelector): boolean;
    remove(): Select;
    static create(nodes: HTMLTypeNodes): Select;
}
//# sourceMappingURL=index.d.ts.map