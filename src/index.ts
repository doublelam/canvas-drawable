import { ifMobile } from "./judge-end";
import { Coordination, PointMode, StrikeStyle } from "./type";
export class CanvasDrawable {
  private canvasContext: CanvasRenderingContext2D;
  private pointStyle: StrikeStyle;
  private lastPoint: Coordination = [0, 0];
  private lastEndPoint: Coordination = [0, 0];
  private paddingAndBorder: Coordination = [0, 0];
  private domPosition: Coordination = [0, 0];
  private drawScale: number = 1;
  private pointMode: PointMode = "DRAW";
  private innerWidthAndHeight: Coordination = [0, 0];
  constructor(canvasContext: CanvasRenderingContext2D, opt: StrikeStyle = {
    color: "rgba(0,0,0,.5)",
    width: 1,
  }) {
    this.canvasContext = canvasContext;
    this.pointStyle = opt;
    this.bandMethods();
    this.getCanvasPaddingAndBorder(canvasContext);
  }

  public native(type: string, ...opt): CanvasDrawable {
    this.canvasContext[type](...opt);
    return this;
  }

  public setStyle(option: StrikeStyle): CanvasDrawable {
    this.pointStyle = option;
    return this;
  }

  public getStyle(): StrikeStyle {
    return this.pointStyle;
  }

  public clearAll() {
    this.canvasContext.clearRect(0, 0, this.innerWidthAndHeight[0], this.innerWidthAndHeight[1]);
  }

  public getCanvasBase64(...args): string {
    return this.canvasContext.canvas.toDataURL(...args);
  }

  public getCanvasBlob(...args): Promise<any> {
    return new Promise((resolve, reject) => {
      this.canvasContext.canvas.toBlob(blob => resolve(blob), ...args);
    }).catch(e => {
      Promise.reject(e);
    });
  }

  public enerase(): CanvasDrawable {
    this.pointMode = "ERASE";
    return this;
  }

  public endraw(): CanvasDrawable {
    this.pointMode = "DRAW";
    return this;
  }

  private setCanvasStroke(): void {
    this.canvasContext.strokeStyle = this.pointStyle.color;
  }

  private getCanvasPaddingAndBorder(canvasContext: CanvasRenderingContext2D): void {
    const styles = getComputedStyle(canvasContext.canvas);
    const canvasRect = canvasContext.canvas.getBoundingClientRect();
    this.domPosition = [canvasRect.left, canvasRect.top];
    this.paddingAndBorder = [
      parseFloat(styles.paddingLeft) + parseFloat(styles.borderLeftWidth),
      parseFloat(styles.paddingTop) + parseFloat(styles.borderTopWidth),
    ];
    this.innerWidthAndHeight = [
      this.canvasContext.canvas.clientWidth,
      this.canvasContext.canvas.clientHeight,
    ];
  }
  private recalculateCoordination(coordinate: Coordination): Coordination {
    return [
      coordinate[0] - this.domPosition[0] - this.paddingAndBorder[0],
      coordinate[1] - this.domPosition[1] - this.paddingAndBorder[1],
    ];
  }

  private bandMethods(): CanvasDrawable {
    const can = this.canvasContext.canvas;
    if (ifMobile) {
      can.ontouchstart = e => {
        const reCoordinate = this.recalculateCoordination([e.touches[0].clientX, e.touches[0].clientY]);
        this.touched(reCoordinate[0], reCoordinate[1]);
      };
      can.ontouchmove = e => {
        const reCoordinate = this.recalculateCoordination([e.touches[0].clientX, e.touches[0].clientY]);
        this.moveWhenErase(reCoordinate[0], reCoordinate[1]);
        this.moveWhenDraw(reCoordinate[0], reCoordinate[1]);
      };

      return this;
    }
    can.onmousedown = e => {
      const reCoordinate = this.recalculateCoordination([e.clientX, e.clientY]);
      this.touched(reCoordinate[0], reCoordinate[1]);
    };
    can.onmousemove = e => {
      if (e.buttons <= 0) {
        return;
      }
      const reCoordinate = this.recalculateCoordination([e.clientX, e.clientY]);
      this.moveWhenErase(reCoordinate[0], reCoordinate[1]);
      this.moveWhenDraw(reCoordinate[0], reCoordinate[1]);
    };
    return this;
  }

  private touched(x: number, y: number): void {
    this.lastPoint = [x, y];
    this.lastEndPoint = [x, y];
    this.setCanvasStroke();
  }

  private moveWhenErase(x: number, y: number, width: number = 10): void {
    if (this.pointMode !== "ERASE") {
      return;
    }
    const halfSide: number = width / 2;
    const startPoint: Coordination = [x - halfSide, y - halfSide];
    this.canvasContext.clearRect(startPoint[0], startPoint[1], width, width);
  }

  private moveWhenDraw(x: number, y: number, scale = this.drawScale): void {
    if (this.pointMode !== "DRAW") {
      return;
    }
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(this.lastEndPoint[0], this.lastEndPoint[1]);
    const endPoint: [number, number] = [
      (x - this.lastPoint[0]) * scale + this.lastEndPoint[0],
      (y - this.lastPoint[1]) * scale + this.lastEndPoint[1],
    ];
    this.canvasContext.lineTo(
      endPoint[0],
      endPoint[1],
    );
    this.canvasContext.stroke();
    this.canvasContext.closePath();
    this.lastPoint = [x, y];
    this.lastEndPoint = endPoint;
  }

}
