"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const judge_end_1 = require("./judge-end");
class CanvasDrawable {
    constructor(canvasContext, opt = {
            color: "rgba(0,0,0,.5)",
            width: 1,
        }) {
        this.lastPoint = [0, 0];
        this.lastEndPoint = [0, 0];
        this.paddingAndBorder = [0, 0];
        this.domPosition = [0, 0];
        this.drawScale = 1;
        this.pointMode = "DRAW";
        this.innerWidthAndHeight = [0, 0];
        this.canvasContext = canvasContext;
        this.pointStyle = opt;
        this.bandMethods();
        this.getCanvasPaddingAndBorder(canvasContext);
    }
    native(type, ...opt) {
        this.canvasContext[type](...opt);
        return this;
    }
    nativeContext() {
        return this.canvasContext;
    }
    setStyle(option) {
        this.pointStyle = option;
        return this;
    }
    getStyle() {
        return this.pointStyle;
    }
    clearAll() {
        this.canvasContext.clearRect(0, 0, this.innerWidthAndHeight[0], this.innerWidthAndHeight[1]);
    }
    getCanvasBase64(...args) {
        return this.canvasContext.canvas.toDataURL(...args);
    }
    getCanvasBlob(...args) {
        return new Promise((resolve, reject) => {
            this.canvasContext.canvas.toBlob(blob => resolve(blob), ...args);
        }).catch(e => {
            Promise.reject(e);
        });
    }
    enerase() {
        this.pointMode = "ERASE";
        return this;
    }
    endraw() {
        this.pointMode = "DRAW";
        return this;
    }
    setCanvasStroke() {
        this.canvasContext.strokeStyle = this.pointStyle.color;
        this.canvasContext.lineWidth = this.pointStyle.width;
    }
    getCanvasPaddingAndBorder(canvasContext) {
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
    recalculateCoordination(coordinate) {
        return [
            coordinate[0] - this.domPosition[0] - this.paddingAndBorder[0],
            coordinate[1] - this.domPosition[1] - this.paddingAndBorder[1],
        ];
    }
    bandMethods() {
        const can = this.canvasContext.canvas;
        if (judge_end_1.ifMobile) {
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
    touched(x, y) {
        this.lastPoint = [x, y];
        this.lastEndPoint = [x, y];
        this.setCanvasStroke();
    }
    moveWhenErase(x, y, width = 10) {
        if (this.pointMode !== "ERASE") {
            return;
        }
        const halfSide = width / 2;
        const startPoint = [x - halfSide, y - halfSide];
        this.canvasContext.clearRect(startPoint[0], startPoint[1], width, width);
    }
    moveWhenDraw(x, y, scale = this.drawScale) {
        if (this.pointMode !== "DRAW") {
            return;
        }
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(this.lastEndPoint[0], this.lastEndPoint[1]);
        const endPoint = [
            (x - this.lastPoint[0]) * scale + this.lastEndPoint[0],
            (y - this.lastPoint[1]) * scale + this.lastEndPoint[1],
        ];
        this.canvasContext.lineTo(endPoint[0], endPoint[1]);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.lastPoint = [x, y];
        this.lastEndPoint = endPoint;
    }
}
exports.CanvasDrawable = CanvasDrawable;
//# sourceMappingURL=index.js.map