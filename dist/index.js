"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var judge_end_1 = require("./judge-end");
var CanvasDrawable = (function () {
    function CanvasDrawable(canvasContext, opt) {
        if (opt === void 0) { opt = {
            color: "rgba(0,0,0,.3)",
        }; }
        this.lastPoint = [0, 0];
        this.lastEndPoint = [0, 0];
        this.paddingAndBorder = [0, 0];
        this.domPosition = [0, 0];
        this.drawScale = 1;
        this.canvasContext = canvasContext;
        this.pointStyle = opt;
        this.bandMethods();
        this.getCanvasPaddingAndBorder(canvasContext);
    }
    CanvasDrawable.prototype.native = function (type) {
        var opt = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            opt[_i - 1] = arguments[_i];
        }
        (_a = this.canvasContext)[type].apply(_a, opt);
        return this;
        var _a;
    };
    CanvasDrawable.prototype.setCanvasStroke = function () {
        this.canvasContext.strokeStyle = this.pointStyle.color;
    };
    CanvasDrawable.prototype.getCanvasPaddingAndBorder = function (canvasContext) {
        var styles = getComputedStyle(canvasContext.canvas);
        this.domPosition = [canvasContext.canvas.offsetLeft, canvasContext.canvas.offsetTop];
        this.paddingAndBorder = [
            parseFloat(styles.paddingLeft) + parseFloat(styles.borderLeftWidth),
            parseFloat(styles.paddingTop) + parseFloat(styles.borderTopWidth),
        ];
    };
    CanvasDrawable.prototype.recalculateCoordination = function (coordinate) {
        return [
            coordinate[0] - this.domPosition[0] - this.paddingAndBorder[0],
            coordinate[1] - this.domPosition[1] - this.paddingAndBorder[1],
        ];
    };
    CanvasDrawable.prototype.bandMethods = function () {
        var _this = this;
        var can = this.canvasContext.canvas;
        if (judge_end_1.ifMobile) {
            can.ontouchstart = function (e) {
                var reCoordinate = _this.recalculateCoordination([e.touches[0].clientX, e.touches[0].clientY]);
                _this.touched(reCoordinate[0], reCoordinate[1]);
            };
            can.ontouchmove = function (e) {
                var reCoordinate = _this.recalculateCoordination([e.touches[0].clientX, e.touches[0].clientY]);
                _this.move(reCoordinate[0], reCoordinate[1]);
            };
            return this;
        }
        can.onmousedown = function (e) {
            var reCoordinate = _this.recalculateCoordination([e.clientX, e.clientY]);
            _this.touched(reCoordinate[0], reCoordinate[1]);
        };
        can.onmousemove = function (e) {
            if (e.buttons <= 0) {
                return;
            }
            var reCoordinate = _this.recalculateCoordination([e.clientX, e.clientY]);
            _this.move(reCoordinate[0], reCoordinate[1]);
        };
        return this;
    };
    CanvasDrawable.prototype.touched = function (x, y) {
        this.lastPoint = [x, y];
        this.lastEndPoint = [x, y];
        this.setCanvasStroke();
    };
    CanvasDrawable.prototype.move = function (x, y, scale) {
        if (scale === void 0) { scale = this.drawScale; }
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(this.lastEndPoint[0], this.lastEndPoint[1]);
        var endPoint = [
            (x - this.lastPoint[0]) * scale + this.lastEndPoint[0],
            (y - this.lastPoint[1]) * scale + this.lastEndPoint[1],
        ];
        this.canvasContext.lineTo(endPoint[0], endPoint[1]);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.lastPoint = [x, y];
        this.lastEndPoint = endPoint;
    };
    return CanvasDrawable;
}());
exports.CanvasDrawable = CanvasDrawable;
//# sourceMappingURL=index.js.map