import { StrikeStyle } from "./type";
export declare class CanvasDrawable {
    private canvasContext;
    private pointStyle;
    private lastPoint;
    private lastEndPoint;
    private paddingAndBorder;
    private domPosition;
    private drawScale;
    private pointMode;
    private innerWidthAndHeight;
    constructor(canvasContext: CanvasRenderingContext2D, opt?: StrikeStyle);
    native(type: string, ...opt: any[]): CanvasDrawable;
    nativeContext(): CanvasRenderingContext2D;
    setStyle(option: StrikeStyle): CanvasDrawable;
    getStyle(): StrikeStyle;
    cleanAll(): void;
    getCanvasBase64(...args: any[]): string;
    getCanvasBlob(...args: any[]): Promise<Blob>;
    enerase(): CanvasDrawable;
    endraw(): CanvasDrawable;
    private setCanvasStroke();
    private getCanvasPaddingAndBorder(canvasContext);
    private recalculateCoordination(coordinate);
    private bandMethods();
    private touched(x, y);
    private moveWhenErase(x, y, width?);
    private moveWhenDraw(x, y, scale?);
}
