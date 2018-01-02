"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ifHasTouch = function () {
    if (window.ontouchstart !== void 0) {
        return true;
    }
    return false;
};
exports.ifMobile = ifHasTouch();
//# sourceMappingURL=judge-end.js.map