import { NgModule } from "@angular/core";
import { NgGridPlaceholder } from "./../components/NgGridPlaceholder";
import { NgGridItem } from "./../directives/NgGridItem";
import { NgGrid } from "./../directives/NgGrid";
var NgGridModule = /** @class */ (function () {
    function NgGridModule() {
    }
    NgGridModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NgGrid, NgGridItem, NgGridPlaceholder],
                    entryComponents: [NgGridPlaceholder],
                    exports: [NgGrid, NgGridItem],
                },] },
    ];
    return NgGridModule;
}());
export { NgGridModule };
//# sourceMappingURL=NgGrid.module.js.map