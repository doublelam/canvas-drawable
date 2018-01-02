export declare class CanvasDrawable {
    private canvasContext;
    private pointStyle;
    private lastPoint;
    private lastEndPoint;
    private paddingAndBorder;
    private domPosition;
    private drawScale;
    constructor(canvasContext: CanvasRenderingContext2D, opt?: {
        color: string;
    });
    native(type: string, ...opt: any[]): CanvasDrawable;
    private setCanvasStroke();
    private getCanvasPaddingAndBorder(canvasContext);
    private recalculateCoordination(coordinate);
    private bandMethods();
    private touched(x, y);
    private move(x, y, scale?);
}
