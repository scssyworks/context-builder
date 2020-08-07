import { Select, HTMLSelector } from '../Select';
export declare class CursorPlacement {
    target: Select;
    targetPlacement: DOMRect | null;
    windowProps: {
        width: number;
        height: number;
    };
    constructor(event: MouseEvent, element: HTMLSelector);
    getClientX(event: MouseEvent): number;
    getClientY(event: MouseEvent): number;
}
//# sourceMappingURL=index.d.ts.map