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
    map(evaluatorFn: (n: Node, i: number) => any): any[];
    filter(evaluatorFn: (n: Node, i: number) => boolean): Select;
    add(selection: Select): Select;
    getBodyTag(): Select;
    children(): Select;
    on(eventType: string, cb: (e: any) => any, useCapture?: boolean): Select;
    off(eventType: string, cb: (e: any) => any, useCapture?: boolean): Select;
    once(eventType: string, cb: (e: any) => any, useCapture?: boolean): Select;
    bounds(): (DOMRect | null)[];
    setCSSProps(obj: {
        [prop: string]: any;
    }): Select;
    setAttr(obj: {
        [prop: string]: string | number | boolean | null | undefined;
    }, polite?: boolean): Select;
    reflow(): Select;
    contains(nodes: HTMLSelector): boolean;
    remove(): Select;
    emit(eventName: string, ...args: any[]): Select;
    static create(nodes: HTMLTypeNodes): Select;
}
//# sourceMappingURL=index.d.ts.map