import { ifMobile } from "./judge-end";
import { Coordination } from "./type";
export class CanvasDrawable {
  private canvasContext: CanvasRenderingContext2D;
  private pointStyle;
  private lastPoint: Coordination = [0, 0];
  private lastEndPoint: Coordination = [0, 0];
  private paddingAndBorder: Coordination = [0, 0];
  private domPosition: Coordination = [0, 0];
  private drawScale: number = 1;
  constructor(canvasContext: CanvasRenderingContext2D, opt = {
    color: "rgba(0,0,0,.3)",
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

  private setCanvasStroke() {
    this.canvasContext.strokeStyle = this.pointStyle.color;
  }

  private getCanvasPaddingAndBorder(canvasContext: CanvasRenderingContext2D): void {
    const styles = getComputedStyle(canvasContext.canvas);
    this.domPosition = [canvasContext.canvas.offsetLeft, canvasContext.canvas.offsetTop];
    this.paddingAndBorder = [
      parseFloat(styles.paddingLeft) + parseFloat(styles.borderLeftWidth),
      parseFloat(styles.paddingTop) + parseFloat(styles.borderTopWidth),
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
        this.move(reCoordinate[0], reCoordinate[1]);
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
      this.move(reCoordinate[0], reCoordinate[1]);
    };
    return this;
  }

  private touched(x: number, y: number) {
    this.lastPoint = [x, y];
    this.lastEndPoint = [x, y];
    this.setCanvasStroke();
  }

  private move(x: number, y: number, scale = this.drawScale) {
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
