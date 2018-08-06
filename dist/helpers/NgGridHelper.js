// @dynamic
var NgGridHelper = /** @class */ (function () {
    function NgGridHelper() {
    }
    NgGridHelper.generateUuid = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            // tslint:disable:no-bitwise
            var r = Math.random() * 16 | 0;
            var v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
            // tslint:enable:no-bitwise
        });
    };
    NgGridHelper.sortItemsByPositionHorizontal = function (a, b) {
        if (a.col === b.col) {
            return a.row - b.row;
        }
        return a.col - b.col;
    };
    NgGridHelper.sortItemsByPositionVertical = function (a, b) {
        if (a.row === b.row) {
            return a.col - b.col;
        }
        return a.row - b.row;
    };
    return NgGridHelper;
}());
export { NgGridHelper };
//# sourceMappingURL=NgGridHelper.js.map