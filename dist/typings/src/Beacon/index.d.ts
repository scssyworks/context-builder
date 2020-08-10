import { ContextMenu } from "..";
export declare class Beacon<T extends HTMLElement> {
    #private;
    constructor(parentThis: ContextMenu<T>);
    emit(): void;
    listen(resolve: (value: boolean) => void): void;
    off(): void;
}
//# sourceMappingURL=index.d.ts.map