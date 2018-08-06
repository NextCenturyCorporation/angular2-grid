(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs'], factory) :
    (factory((global.ng = global.ng || {}, global.ng.grid = {}),global.ng.core,global.rxjs));
}(this, (function (exports,core,rxjs) { 'use strict';

    var NgGridPlaceholder = /** @class */ (function () {
        function NgGridPlaceholder(_ngEl, _renderer) {
            this._ngEl = _ngEl;
            this._renderer = _renderer;
        }
        NgGridPlaceholder.prototype.registerGrid = function (ngGrid) {
            this._ngGrid = ngGrid;
        };
        NgGridPlaceholder.prototype.ngOnInit = function () {
            this._renderer.setElementClass(this._ngEl.nativeElement, "grid-placeholder", true);
            if (this._ngGrid.autoStyle) {
                this._renderer.setElementStyle(this._ngEl.nativeElement, "position", "absolute");
            }
        };
        NgGridPlaceholder.prototype.setSize = function (newSize) {
            this._size = newSize;
            this._recalculateDimensions();
        };
        NgGridPlaceholder.prototype.setGridPosition = function (newPosition) {
            this._position = newPosition;
            this._recalculatePosition();
        };
        NgGridPlaceholder.prototype.setCascadeMode = function (cascade) {
            this._cascadeMode = cascade;
            switch (cascade) {
                case "up":
                case "left":
                default:
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "left", "0px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "top", "0px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "right", null);
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "bottom", null);
                    break;
                case "right":
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "right", "0px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "top", "0px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "left", null);
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "bottom", null);
                    break;
                case "down":
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "left", "0px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "bottom", "0px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "right", null);
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "top", null);
                    break;
            }
        };
        // 	Private methods
        NgGridPlaceholder.prototype._setDimensions = function (w, h) {
            this._renderer.setElementStyle(this._ngEl.nativeElement, "width", w + "px");
            this._renderer.setElementStyle(this._ngEl.nativeElement, "height", h + "px");
        };
        NgGridPlaceholder.prototype._setPosition = function (x, y) {
            switch (this._cascadeMode) {
                case "up":
                case "left":
                default:
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "transform", "translate(" + x + "px, " + y + "px)");
                    break;
                case "right":
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "transform", "translate(" + -x + "px, " + y + "px)");
                    break;
                case "down":
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "transform", "translate(" + x + "px, " + -y + "px)");
                    break;
            }
        };
        NgGridPlaceholder.prototype._recalculatePosition = function () {
            var x = (this._ngGrid.colWidth + this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._position.col - 1) + this._ngGrid.marginLeft + this._ngGrid.screenMargin;
            var y = (this._ngGrid.rowHeight + this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._position.row - 1) + this._ngGrid.marginTop;
            this._setPosition(x, y);
        };
        NgGridPlaceholder.prototype._recalculateDimensions = function () {
            var w = (this._ngGrid.colWidth * this._size.x) + ((this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._size.x - 1));
            var h = (this._ngGrid.rowHeight * this._size.y) + ((this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._size.y - 1));
            this._setDimensions(w, h);
        };
        NgGridPlaceholder.decorators = [
            { type: core.Component, args: [{
                        selector: "ng-grid-placeholder",
                        template: "",
                    },] },
        ];
        /** @nocollapse */
        NgGridPlaceholder.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer }
        ]; };
        return NgGridPlaceholder;
    }());

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

    var NgGrid = /** @class */ (function () {
        //	Constructor
        function NgGrid(_differs, _ngEl, _renderer, componentFactoryResolver) {
            this._differs = _differs;
            this._ngEl = _ngEl;
            this._renderer = _renderer;
            this.componentFactoryResolver = componentFactoryResolver;
            //	Event Emitters
            this.onDragStart = new core.EventEmitter();
            this.onDrag = new core.EventEmitter();
            this.onDragStop = new core.EventEmitter();
            this.onResizeStart = new core.EventEmitter();
            this.onResize = new core.EventEmitter();
            this.onResizeStop = new core.EventEmitter();
            this.onItemChange = new core.EventEmitter();
            //	Public variables
            this.colWidth = 250;
            this.rowHeight = 250;
            this.minCols = 1;
            this.minRows = 1;
            this.marginTop = 10;
            this.marginRight = 10;
            this.marginBottom = 10;
            this.marginLeft = 10;
            this.screenMargin = 0;
            this.isDragging = false;
            this.isResizing = false;
            this.autoStyle = true;
            this.resizeEnable = true;
            this.dragEnable = true;
            this.cascade = "up";
            this.minWidth = 100;
            this.minHeight = 100;
            this.resizeDirections = NgGrid.CONST_DEFAULT_RESIZE_DIRECTIONS;
            //	Private variables
            this._items = new Map();
            this._draggingItem = null;
            this._resizingItem = null;
            this._resizeDirection = null;
            this._itemsInGrid = new Set();
            this._maxCols = 0;
            this._maxRows = 0;
            this._visibleCols = 0;
            this._visibleRows = 0;
            this._posOffset = null;
            this._placeholderRef = null;
            this._fixToGrid = false;
            this._autoResize = false;
            this._destroyed = false;
            this._maintainRatio = false;
            this._preferNew = false;
            this._zoomOnDrag = false;
            this._limitToScreen = false;
            this._centerToScreen = false;
            this._curMaxRow = 0;
            this._curMaxCol = 0;
            this._dragReady = false;
            this._resizeReady = false;
            this._elementBasedDynamicRowHeight = false;
            this._itemFixDirection = "cascade";
            this._collisionFixDirection = "cascade";
            this._allowOverlap = false;
            this._lastZValue = 1;
            this._subscriptions = [];
            this._enabledListener = false;
            // tslint:enable:object-literal-sort-keys
            this._config = NgGrid.CONST_DEFAULT_CONFIG;
            this._defineListeners();
        }
        Object.defineProperty(NgGrid.prototype, "config", {
            //	[ng-grid] attribute handler
            set: function (v) {
                if (v == null || typeof v !== "object") {
                    return;
                }
                this.setConfig(v);
                if (this._differ == null && v != null) {
                    this._differ = this._differs.find(this._config).create();
                }
                this._differ.diff(this._config);
            },
            enumerable: true,
            configurable: true
        });
        //	Public methods
        NgGrid.prototype.ngOnInit = function () {
            this._renderer.setElementClass(this._ngEl.nativeElement, "grid", true);
            if (this.autoStyle)
                this._renderer.setElementStyle(this._ngEl.nativeElement, "position", "relative");
            this.setConfig(this._config);
        };
        NgGrid.prototype.ngOnDestroy = function () {
            this._destroyed = true;
            this._disableListeners();
        };
        NgGrid.prototype.generateItemUid = function () {
            var uid = NgGridHelper.generateUuid();
            if (this._items.has(uid)) {
                return this.generateItemUid();
            }
            return uid;
        };
        NgGrid.prototype.setConfig = function (config) {
            var _this = this;
            this._config = config;
            var maxColRowChanged = false;
            for (var x in config) {
                if (!(x in config))
                    continue;
                var val = config[x];
                var intVal = !val ? 0 : parseInt(val, 10);
                // tslint:disable-next-line:switch-default
                switch (x) {
                    case "margins":
                        this.setMargins(val);
                        break;
                    case "col_width":
                        this.colWidth = Math.max(intVal, 1);
                        break;
                    case "row_height":
                        this.rowHeight = Math.max(intVal, 1);
                        break;
                    case "auto_style":
                        this.autoStyle = val ? true : false;
                        break;
                    case "auto_resize":
                        this._autoResize = val ? true : false;
                        break;
                    case "draggable":
                        this.dragEnable = val ? true : false;
                        break;
                    case "resizable":
                        this.resizeEnable = val ? true : false;
                        break;
                    case "max_rows":
                        maxColRowChanged = maxColRowChanged || this._maxRows !== intVal;
                        this._maxRows = intVal < 0 ? 0 : intVal;
                        break;
                    case "max_cols":
                        maxColRowChanged = maxColRowChanged || this._maxCols !== intVal;
                        this._maxCols = intVal < 0 ? 0 : intVal;
                        break;
                    case "visible_rows":
                        this._visibleRows = Math.max(intVal, 0);
                        break;
                    case "visible_cols":
                        this._visibleCols = Math.max(intVal, 0);
                        break;
                    case "min_rows":
                        this.minRows = Math.max(intVal, 1);
                        break;
                    case "min_cols":
                        this.minCols = Math.max(intVal, 1);
                        break;
                    case "min_height":
                        this.minHeight = Math.max(intVal, 1);
                        break;
                    case "min_width":
                        this.minWidth = Math.max(intVal, 1);
                        break;
                    case "zoom_on_drag":
                        this._zoomOnDrag = val ? true : false;
                        break;
                    case "cascade":
                        if (this.cascade !== val) {
                            this.cascade = val;
                            this._cascadeGrid();
                        }
                        break;
                    case "fix_to_grid":
                        this._fixToGrid = val ? true : false;
                        break;
                    case "maintain_ratio":
                        this._maintainRatio = val ? true : false;
                        break;
                    case "prefer_new":
                        this._preferNew = val ? true : false;
                        break;
                    case "limit_to_screen":
                        this._limitToScreen = !this._autoResize && !!val;
                        break;
                    case "center_to_screen":
                        this._centerToScreen = val ? true : false;
                        break;
                    case "resize_directions":
                        this.resizeDirections = val || ["bottomright", "bottomleft", "topright", "topleft", "right", "left", "bottom", "top"];
                        break;
                    case "element_based_row_height":
                        this._elementBasedDynamicRowHeight = !!val;
                        break;
                    case "fix_item_position_direction":
                        this._itemFixDirection = val;
                        break;
                    case "fix_collision_position_direction":
                        this._collisionFixDirection = val;
                        break;
                    case "allow_overlap":
                        this._allowOverlap = !!val;
                        break;
                }
            }
            if (this._allowOverlap && this.cascade !== "off" && this.cascade !== "") {
                // tslint:disable-next-line:no-console
                console.warn("Unable to overlap items when a cascade direction is set.");
                this._allowOverlap = false;
            }
            if (this.dragEnable || this.resizeEnable) {
                this._enableListeners();
            }
            else {
                this._disableListeners();
            }
            if (this._itemFixDirection === "cascade") {
                this._itemFixDirection = this._getFixDirectionFromCascade();
            }
            if (this._collisionFixDirection === "cascade") {
                this._collisionFixDirection = this._getFixDirectionFromCascade();
            }
            if (this._limitToScreen) {
                var newMaxCols = this._getContainerColumns();
                if (this._maxCols !== newMaxCols) {
                    this._maxCols = newMaxCols;
                    maxColRowChanged = true;
                }
            }
            if (this._limitToScreen && this._centerToScreen) {
                this.screenMargin = this._getScreenMargin();
            }
            else {
                this.screenMargin = 0;
            }
            if (this._maintainRatio) {
                if (this.colWidth && this.rowHeight) {
                    this._aspectRatio = this.colWidth / this.rowHeight;
                }
                else {
                    this._maintainRatio = false;
                }
            }
            if (maxColRowChanged) {
                if (this._maxCols > 0 && this._maxRows > 0) { //	Can't have both, prioritise on cascade
                    switch (this.cascade) {
                        case "left":
                        case "right":
                            this._maxCols = 0;
                            break;
                        case "up":
                        case "down":
                        default:
                            this._maxRows = 0;
                            break;
                    }
                }
                this._updatePositionsAfterMaxChange();
            }
            this._calculateColWidth();
            this._calculateRowHeight();
            var maxWidth = this._maxCols * this.colWidth;
            var maxHeight = this._maxRows * this.rowHeight;
            if (maxWidth > 0 && this.minWidth > maxWidth)
                this.minWidth = 0.75 * this.colWidth;
            if (maxHeight > 0 && this.minHeight > maxHeight)
                this.minHeight = 0.75 * this.rowHeight;
            if (this.minWidth > this.colWidth)
                this.minCols = Math.max(this.minCols, Math.ceil(this.minWidth / this.colWidth));
            if (this.minHeight > this.rowHeight)
                this.minRows = Math.max(this.minRows, Math.ceil(this.minHeight / this.rowHeight));
            if (this._maxCols > 0 && this.minCols > this._maxCols)
                this.minCols = 1;
            if (this._maxRows > 0 && this.minRows > this._maxRows)
                this.minRows = 1;
            this._updateRatio();
            this._items.forEach(function (item) {
                _this._removeFromGrid(item);
                item.setCascadeMode(_this.cascade);
            });
            this._items.forEach(function (item) {
                item.recalculateSelf();
                _this._addToGrid(item);
            });
            this._cascadeGrid();
            this._updateSize();
        };
        NgGrid.prototype.getItemPosition = function (itemId) {
            return this._items.has(itemId) ? this._items.get(itemId).getGridPosition() : null;
        };
        NgGrid.prototype.getItemSize = function (itemId) {
            return this._items.has(itemId) ? this._items.get(itemId).getSize() : null;
        };
        NgGrid.prototype.ngDoCheck = function () {
            if (this._differ != null) {
                var changes = this._differ.diff(this._config);
                if (changes != null) {
                    this._applyChanges(changes);
                    return true;
                }
            }
            return false;
        };
        NgGrid.prototype.setMargins = function (margins) {
            this.marginTop = Math.max(parseInt(margins[0], 10), 0);
            this.marginRight = margins.length >= 2 ? Math.max(parseInt(margins[1], 10), 0) : this.marginTop;
            this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2], 10), 0) : this.marginTop;
            this.marginLeft = margins.length >= 4 ? Math.max(parseInt(margins[3], 10), 0) : this.marginRight;
        };
        NgGrid.prototype.enableDrag = function () {
            this.dragEnable = true;
        };
        NgGrid.prototype.disableDrag = function () {
            this.dragEnable = false;
        };
        NgGrid.prototype.enableResize = function () {
            this.resizeEnable = true;
        };
        NgGrid.prototype.disableResize = function () {
            this.resizeEnable = false;
        };
        NgGrid.prototype.addItem = function (ngItem) {
            var _this = this;
            ngItem.setCascadeMode(this.cascade);
            if (!this._preferNew) {
                var newPos = this._fixGridPosition(ngItem.getGridPosition(), ngItem.getSize());
                ngItem.setGridPosition(newPos);
            }
            if (ngItem.uid === null || this._items.has(ngItem.uid)) {
                ngItem.uid = this.generateItemUid();
            }
            this._items.set(ngItem.uid, ngItem);
            this._addToGrid(ngItem);
            this._updateSize();
            this.triggerCascade().then(function () {
                ngItem.recalculateSelf();
                ngItem.onCascadeEvent();
                _this._emitOnItemChange();
            });
        };
        NgGrid.prototype.removeItem = function (ngItem) {
            var _this = this;
            this._removeFromGrid(ngItem);
            this._items.delete(ngItem.uid);
            if (this._destroyed)
                return;
            this.triggerCascade().then(function () {
                _this._updateSize();
                _this._items.forEach(function (item) { return item.recalculateSelf(); });
                _this._emitOnItemChange();
            });
        };
        NgGrid.prototype.updateItem = function (ngItem) {
            var _this = this;
            this._removeFromGrid(ngItem);
            this._addToGrid(ngItem);
            this.triggerCascade().then(function () {
                _this._updateSize();
                ngItem.onCascadeEvent();
            });
        };
        NgGrid.prototype.triggerCascade = function () {
            var _this = this;
            if (!this._cascadePromise) {
                this._cascadePromise = new Promise(function (resolve) {
                    setTimeout(function () {
                        _this._cascadePromise = null;
                        _this._cascadeGrid(null, null);
                        resolve();
                    }, 0);
                });
            }
            return this._cascadePromise;
        };
        NgGrid.prototype.triggerResize = function () {
            this.resizeEventHandler(null);
        };
        NgGrid.prototype.resizeEventHandler = function (e) {
            this._calculateColWidth();
            this._calculateRowHeight();
            this._updateRatio();
            if (this._limitToScreen) {
                var newMaxColumns = this._getContainerColumns();
                if (this._maxCols !== newMaxColumns) {
                    this._maxCols = newMaxColumns;
                    this._updatePositionsAfterMaxChange();
                    this._cascadeGrid();
                }
                if (this._centerToScreen) {
                    this.screenMargin = this._getScreenMargin();
                    this._items.forEach(function (item) {
                        item.recalculateSelf();
                    });
                }
            }
            else if (this._autoResize) {
                this._items.forEach(function (item) {
                    item.recalculateSelf();
                });
            }
            this._updateSize();
        };
        NgGrid.prototype.mouseDownEventHandler = function (e) {
            var mousePos = this._getMousePosition(e);
            var item = this._getItemFromPosition(mousePos);
            if (item == null)
                return;
            var resizeDirection = item.canResize(e);
            if (this.resizeEnable && resizeDirection) {
                this._resizeReady = true;
                this._resizingItem = item;
                this._resizeDirection = resizeDirection;
                e.preventDefault();
            }
            else if (this.dragEnable && item.canDrag(e)) {
                this._dragReady = true;
                this._draggingItem = item;
                var itemPos = item.getPosition();
                this._posOffset = { left: (mousePos.left - itemPos.left), top: (mousePos.top - itemPos.top) };
                e.preventDefault();
            }
        };
        NgGrid.prototype.mouseUpEventHandler = function (e) {
            if (this.isDragging) {
                this._dragStop(e);
            }
            else if (this.isResizing) {
                this._resizeStop(e);
            }
            else if (this._dragReady || this._resizeReady) {
                this._cleanDrag();
                this._cleanResize();
            }
        };
        NgGrid.prototype.mouseMoveEventHandler = function (e) {
            if (this._resizeReady) {
                this._resizeStart(e);
                e.preventDefault();
                return;
            }
            else if (this._dragReady) {
                this._dragStart(e);
                e.preventDefault();
                return;
            }
            if (this.isDragging) {
                this._drag(e);
            }
            else if (this.isResizing) {
                this._resize(e);
            }
            else {
                var mousePos = this._getMousePosition(e);
                var item = this._getItemFromPosition(mousePos);
                if (item) {
                    item.onMouseMove(e);
                }
            }
        };
        //	Private methods
        NgGrid.prototype._getFixDirectionFromCascade = function () {
            switch (this.cascade) {
                case "up":
                case "down":
                default:
                    return "vertical";
                case "left":
                case "right":
                    return "horizontal";
            }
        };
        NgGrid.prototype._updatePositionsAfterMaxChange = function () {
            var _this = this;
            this._items.forEach(function (item) {
                var pos = item.getGridPosition();
                var dims = item.getSize();
                if (!_this._hasGridCollision(pos, dims) && _this._isWithinBounds(pos, dims) && dims.x <= _this._maxCols && dims.y <= _this._maxRows) {
                    return;
                }
                _this._removeFromGrid(item);
                if (_this._maxCols > 0 && dims.x > _this._maxCols) {
                    dims.x = _this._maxCols;
                    item.setSize(dims);
                }
                else if (_this._maxRows > 0 && dims.y > _this._maxRows) {
                    dims.y = _this._maxRows;
                    item.setSize(dims);
                }
                if (_this._hasGridCollision(pos, dims) || !_this._isWithinBounds(pos, dims, true)) {
                    var newPosition = _this._fixGridPosition(pos, dims);
                    item.setGridPosition(newPosition);
                }
                _this._addToGrid(item);
            });
        };
        NgGrid.prototype._calculateColWidth = function () {
            if (this._autoResize) {
                if (this._maxCols > 0 || this._visibleCols > 0) {
                    var maxCols = this._maxCols > 0 ? this._maxCols : this._visibleCols;
                    var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
                    var colWidth = Math.floor(maxWidth / maxCols);
                    colWidth -= (this.marginLeft + this.marginRight);
                    if (colWidth > 0)
                        this.colWidth = colWidth;
                }
            }
            if (this.colWidth < this.minWidth || this.minCols > this._config.min_cols) {
                this.minCols = Math.max(this._config.min_cols, Math.ceil(this.minWidth / this.colWidth));
            }
        };
        NgGrid.prototype._calculateRowHeight = function () {
            if (this._autoResize) {
                if (this._maxRows > 0 || this._visibleRows > 0) {
                    var maxRows = this._maxRows > 0 ? this._maxRows : this._visibleRows;
                    var maxHeight = void 0;
                    if (this._elementBasedDynamicRowHeight) {
                        maxHeight = this._ngEl.nativeElement.getBoundingClientRect().height;
                    }
                    else {
                        maxHeight = window.innerHeight - this.marginTop - this.marginBottom;
                    }
                    var rowHeight = Math.max(Math.floor(maxHeight / maxRows), this.minHeight);
                    rowHeight -= (this.marginTop + this.marginBottom);
                    if (rowHeight > 0)
                        this.rowHeight = rowHeight;
                }
            }
            if (this.rowHeight < this.minHeight || this.minRows > this._config.min_rows) {
                this.minRows = Math.max(this._config.min_rows, Math.ceil(this.minHeight / this.rowHeight));
            }
        };
        NgGrid.prototype._updateRatio = function () {
            if (!this._autoResize || !this._maintainRatio)
                return;
            if (this._maxCols > 0 && this._visibleRows <= 0) {
                this.rowHeight = this.colWidth / this._aspectRatio;
            }
            else if (this._maxRows > 0 && this._visibleCols <= 0) {
                this.colWidth = this._aspectRatio * this.rowHeight;
            }
            else if (this._maxCols === 0 && this._maxRows === 0) {
                if (this._visibleCols > 0) {
                    this.rowHeight = this.colWidth / this._aspectRatio;
                }
                else if (this._visibleRows > 0) {
                    this.colWidth = this._aspectRatio * this.rowHeight;
                }
            }
        };
        NgGrid.prototype._applyChanges = function (changes) {
            var _this = this;
            changes.forEachAddedItem(function (record) { _this._config[record.key] = record.currentValue; });
            changes.forEachChangedItem(function (record) { _this._config[record.key] = record.currentValue; });
            changes.forEachRemovedItem(function (record) { delete _this._config[record.key]; });
            this.setConfig(this._config);
        };
        NgGrid.prototype._resizeStart = function (e) {
            if (!this.resizeEnable || !this._resizingItem)
                return;
            //	Setup
            this._resizingItem.startMoving();
            this._removeFromGrid(this._resizingItem);
            this._createPlaceholder(this._resizingItem);
            if (this._allowOverlap) {
                this._resizingItem.zIndex = this._lastZValue++;
            }
            //	Status Flags
            this.isResizing = true;
            this._resizeReady = false;
            //	Events
            this.onResizeStart.emit(this._resizingItem);
            this._resizingItem.onResizeStartEvent();
        };
        NgGrid.prototype._dragStart = function (e) {
            if (!this.dragEnable || !this._draggingItem)
                return;
            //	Start dragging
            this._draggingItem.startMoving();
            this._removeFromGrid(this._draggingItem);
            this._createPlaceholder(this._draggingItem);
            if (this._allowOverlap) {
                this._draggingItem.zIndex = this._lastZValue++;
            }
            //	Status Flags
            this.isDragging = true;
            this._dragReady = false;
            //	Events
            this.onDragStart.emit(this._draggingItem);
            this._draggingItem.onDragStartEvent();
            //	Zoom
            if (this._zoomOnDrag) {
                this._zoomOut();
            }
        };
        NgGrid.prototype._zoomOut = function () {
            this._renderer.setElementStyle(this._ngEl.nativeElement, "transform", "scale(0.5, 0.5)");
        };
        NgGrid.prototype._resetZoom = function () {
            this._renderer.setElementStyle(this._ngEl.nativeElement, "transform", "");
        };
        NgGrid.prototype._drag = function (e) {
            if (!this.isDragging)
                return;
            if (window.getSelection) {
                if (window.getSelection().empty) {
                    window.getSelection().empty();
                }
                else if (window.getSelection().removeAllRanges) {
                    window.getSelection().removeAllRanges();
                }
            }
            else if (document.selection) {
                document.selection.empty();
            }
            var mousePos = this._getMousePosition(e);
            var newL = (mousePos.left - this._posOffset.left);
            var newT = (mousePos.top - this._posOffset.top);
            var itemPos = this._draggingItem.getGridPosition();
            var gridPos = this._calculateGridPosition(newL, newT);
            var dims = this._draggingItem.getSize();
            gridPos = this._fixPosToBoundsX(gridPos, dims);
            if (!this._isWithinBoundsY(gridPos, dims)) {
                gridPos = this._fixPosToBoundsY(gridPos, dims);
            }
            if (gridPos.col !== itemPos.col || gridPos.row !== itemPos.row) {
                this._draggingItem.setGridPosition(gridPos, this._fixToGrid);
                this._placeholderRef.instance.setGridPosition(gridPos);
                if (["up", "down", "left", "right"].indexOf(this.cascade) >= 0) {
                    this._fixGridCollisions(gridPos, dims);
                    this._cascadeGrid(gridPos, dims);
                }
            }
            if (!this._fixToGrid) {
                this._draggingItem.setPosition(newL, newT);
            }
            this.onDrag.emit(this._draggingItem);
            this._draggingItem.onDragEvent();
        };
        NgGrid.prototype._resize = function (e) {
            if (!this.isResizing) {
                return;
            }
            if (window.getSelection) {
                if (window.getSelection().empty) {
                    window.getSelection().empty();
                }
                else if (window.getSelection().removeAllRanges) {
                    window.getSelection().removeAllRanges();
                }
            }
            else if (document.selection) {
                document.selection.empty();
            }
            var mousePos = this._getMousePosition(e);
            var itemPos = this._resizingItem.getPosition();
            var itemDims = this._resizingItem.getDimensions();
            var endCorner = {
                left: itemPos.left + itemDims.width,
                top: itemPos.top + itemDims.height,
            };
            var resizeTop = this._resizeDirection.includes("top");
            var resizeBottom = this._resizeDirection.includes("bottom");
            var resizeLeft = this._resizeDirection.includes("left");
            var resizeRight = this._resizeDirection.includes("right");
            //	Calculate new width and height based upon resize direction
            var newW = resizeRight
                ? (mousePos.left - itemPos.left + 1)
                : resizeLeft
                    ? (endCorner.left - mousePos.left + 1)
                    : itemDims.width;
            var newH = resizeBottom
                ? (mousePos.top - itemPos.top + 1)
                : resizeTop
                    ? (endCorner.top - mousePos.top + 1)
                    : itemDims.height;
            if (newW < this.minWidth)
                newW = this.minWidth;
            if (newH < this.minHeight)
                newH = this.minHeight;
            if (newW < this._resizingItem.minWidth)
                newW = this._resizingItem.minWidth;
            if (newH < this._resizingItem.minHeight)
                newH = this._resizingItem.minHeight;
            var newX = itemPos.left;
            var newY = itemPos.top;
            if (resizeLeft)
                newX = endCorner.left - newW;
            if (resizeTop)
                newY = endCorner.top - newH;
            var calcSize = this._calculateGridSize(newW, newH);
            var itemSize = this._resizingItem.getSize();
            var iGridPos = this._resizingItem.getGridPosition();
            var bottomRightCorner = {
                col: iGridPos.col + itemSize.x,
                row: iGridPos.row + itemSize.y,
            };
            var targetPos = Object.assign({}, iGridPos);
            if (this._resizeDirection.includes("top"))
                targetPos.row = bottomRightCorner.row - calcSize.y;
            if (this._resizeDirection.includes("left"))
                targetPos.col = bottomRightCorner.col - calcSize.x;
            if (!this._isWithinBoundsX(targetPos, calcSize))
                calcSize = this._fixSizeToBoundsX(targetPos, calcSize);
            if (!this._isWithinBoundsY(targetPos, calcSize))
                calcSize = this._fixSizeToBoundsY(targetPos, calcSize);
            calcSize = this._resizingItem.fixResize(calcSize);
            if (calcSize.x !== itemSize.x || calcSize.y !== itemSize.y) {
                this._resizingItem.setGridPosition(targetPos, this._fixToGrid);
                this._placeholderRef.instance.setGridPosition(targetPos);
                this._resizingItem.setSize(calcSize, this._fixToGrid);
                this._placeholderRef.instance.setSize(calcSize);
                if (["up", "down", "left", "right"].indexOf(this.cascade) >= 0) {
                    this._fixGridCollisions(targetPos, calcSize);
                    this._cascadeGrid(targetPos, calcSize);
                }
            }
            if (!this._fixToGrid) {
                this._resizingItem.setDimensions(newW, newH);
                this._resizingItem.setPosition(newX, newY);
            }
            this.onResize.emit(this._resizingItem);
            this._resizingItem.onResizeEvent();
        };
        NgGrid.prototype._dragStop = function (e) {
            if (!this.isDragging)
                return;
            this.isDragging = false;
            var itemPos = this._draggingItem.getGridPosition();
            this._draggingItem.setGridPosition(itemPos);
            this._addToGrid(this._draggingItem);
            this._cascadeGrid();
            this._updateSize();
            this._draggingItem.stopMoving();
            this._draggingItem.onDragStopEvent();
            this.onDragStop.emit(this._draggingItem);
            this._cleanDrag();
            this._placeholderRef.destroy();
            this._emitOnItemChange();
            if (this._zoomOnDrag) {
                this._resetZoom();
            }
        };
        NgGrid.prototype._resizeStop = function (e) {
            if (!this.isResizing)
                return;
            this.isResizing = false;
            var itemDims = this._resizingItem.getSize();
            this._resizingItem.setSize(itemDims);
            var itemPos = this._resizingItem.getGridPosition();
            this._resizingItem.setGridPosition(itemPos);
            this._addToGrid(this._resizingItem);
            this._cascadeGrid();
            this._updateSize();
            this._resizingItem.stopMoving();
            this._resizingItem.onResizeStopEvent();
            this.onResizeStop.emit(this._resizingItem);
            this._cleanResize();
            this._placeholderRef.destroy();
            this._emitOnItemChange();
        };
        NgGrid.prototype._cleanDrag = function () {
            this._draggingItem = null;
            this._posOffset = null;
            this.isDragging = false;
            this._dragReady = false;
        };
        NgGrid.prototype._cleanResize = function () {
            this._resizingItem = null;
            this._resizeDirection = null;
            this.isResizing = false;
            this._resizeReady = false;
        };
        NgGrid.prototype._calculateGridSize = function (width, height) {
            width += this.marginLeft + this.marginRight;
            height += this.marginTop + this.marginBottom;
            var sizex = Math.max(this.minCols, Math.round(width / (this.colWidth + this.marginLeft + this.marginRight)));
            var sizey = Math.max(this.minRows, Math.round(height / (this.rowHeight + this.marginTop + this.marginBottom)));
            if (!this._isWithinBoundsX({ col: 1, row: 1 }, { x: sizex, y: sizey }))
                sizex = this._maxCols;
            if (!this._isWithinBoundsY({ col: 1, row: 1 }, { x: sizex, y: sizey }))
                sizey = this._maxRows;
            return { x: sizex, y: sizey };
        };
        NgGrid.prototype._calculateGridPosition = function (left, top) {
            var col = Math.max(1, Math.round(left / (this.colWidth + this.marginLeft + this.marginRight)) + 1);
            var row = Math.max(1, Math.round(top / (this.rowHeight + this.marginTop + this.marginBottom)) + 1);
            if (!this._isWithinBoundsX({ col: col, row: row }, { x: 1, y: 1 }))
                col = this._maxCols;
            if (!this._isWithinBoundsY({ col: col, row: row }, { x: 1, y: 1 }))
                row = this._maxRows;
            return { col: col, row: row };
        };
        NgGrid.prototype._hasGridCollision = function (pos, dims) {
            var positions = this._getCollisions(pos, dims);
            if (positions == null || positions.length === 0)
                return false;
            return positions.some(function (v) {
                return !(v === null);
            });
        };
        NgGrid.prototype._getCollisions = function (pos, dims) {
            var _this = this;
            if (this._allowOverlap)
                return [];
            var returns = [];
            if (!pos.col) {
                pos.col = 1;
            }
            if (!pos.row) {
                pos.row = 1;
            }
            var leftCol = pos.col;
            var rightCol = pos.col + dims.x;
            var topRow = pos.row;
            var bottomRow = pos.row + dims.y;
            this._itemsInGrid.forEach(function (itemId) {
                var item = _this._items.get(itemId);
                if (!item) {
                    _this._itemsInGrid.delete(itemId);
                    return;
                }
                var itemLeftCol = item.col;
                var itemRightCol = item.col + item.sizex;
                var itemTopRow = item.row;
                var itemBottomRow = item.row + item.sizey;
                var withinColumns = leftCol < itemRightCol && itemLeftCol < rightCol;
                var withinRows = topRow < itemBottomRow && itemTopRow < bottomRow;
                if (withinColumns && withinRows) {
                    returns.push(item);
                }
            });
            return returns;
        };
        NgGrid.prototype._fixGridCollisions = function (pos, dims) {
            var collisions = this._getCollisions(pos, dims);
            if (collisions.length === 0) {
                return;
            }
            for (var _i = 0, collisions_1 = collisions; _i < collisions_1.length; _i++) {
                var collision = collisions_1[_i];
                this._removeFromGrid(collision);
                var itemDims = collision.getSize();
                var itemPos = collision.getGridPosition();
                var newItemPos = { col: itemPos.col, row: itemPos.row };
                if (this._collisionFixDirection === "vertical") {
                    newItemPos.row = pos.row + dims.y;
                    if (!this._isWithinBoundsY(newItemPos, itemDims)) {
                        newItemPos.col = pos.col + dims.x;
                        newItemPos.row = 1;
                    }
                }
                else if (this._collisionFixDirection === "horizontal") {
                    newItemPos.col = pos.col + dims.x;
                    if (!this._isWithinBoundsX(newItemPos, itemDims)) {
                        newItemPos.col = 1;
                        newItemPos.row = pos.row + dims.y;
                    }
                }
                collision.setGridPosition(newItemPos);
                this._fixGridCollisions(newItemPos, itemDims);
                this._addToGrid(collision);
                collision.onCascadeEvent();
            }
            this._fixGridCollisions(pos, dims);
        };
        NgGrid.prototype._cascadeGrid = function (pos, dims) {
            var _this = this;
            if (this._destroyed)
                return;
            if (this._allowOverlap)
                return;
            if (!pos !== !dims)
                throw new Error("Cannot cascade with only position and not dimensions");
            if (this.isDragging && this._draggingItem && !pos && !dims) {
                pos = this._draggingItem.getGridPosition();
                dims = this._draggingItem.getSize();
            }
            else if (this.isResizing && this._resizingItem && !pos && !dims) {
                pos = this._resizingItem.getGridPosition();
                dims = this._resizingItem.getSize();
            }
            var itemsInGrid = Array.from(this._itemsInGrid, function (itemId) { return _this._items.get(itemId); });
            switch (this.cascade) {
                case "up":
                case "down":
                    itemsInGrid = itemsInGrid.sort(NgGridHelper.sortItemsByPositionVertical);
                    var lowestRowPerColumn = new Map();
                    for (var _i = 0, itemsInGrid_1 = itemsInGrid; _i < itemsInGrid_1.length; _i++) {
                        var item = itemsInGrid_1[_i];
                        if (item.isFixed)
                            continue;
                        var itemDims = item.getSize();
                        var itemPos = item.getGridPosition();
                        var lowestRowForItem = lowestRowPerColumn.get(itemPos.col) || 1;
                        for (var i = 1; i < itemDims.x; i++) {
                            var lowestRowForColumn = lowestRowPerColumn.get(itemPos.col + i) || 1;
                            lowestRowForItem = Math.max(lowestRowForColumn, lowestRowForItem);
                        }
                        var leftCol = itemPos.col;
                        var rightCol = itemPos.col + itemDims.x;
                        if (pos && dims) {
                            var withinColumns = rightCol > pos.col && leftCol < (pos.col + dims.x);
                            if (withinColumns) { //	If our element is in one of the item's columns
                                var roomAboveItem = itemDims.y <= (pos.row - lowestRowForItem);
                                if (!roomAboveItem) { //	Item can't fit above our element
                                    lowestRowForItem = Math.max(lowestRowForItem, pos.row + dims.y); //	Set the lowest row to be below it
                                }
                            }
                        }
                        var newPos = { col: itemPos.col, row: lowestRowForItem };
                        //	What if it's not within bounds Y?
                        if (lowestRowForItem !== itemPos.row && this._isWithinBoundsY(newPos, itemDims)) { //	If the item is not already on this row move it up
                            this._removeFromGrid(item);
                            item.setGridPosition(newPos);
                            item.onCascadeEvent();
                            this._addToGrid(item);
                        }
                        for (var i = 0; i < itemDims.x; i++) {
                            lowestRowPerColumn.set(itemPos.col + i, lowestRowForItem + itemDims.y); //	Update the lowest row to be below the item
                        }
                    }
                    break;
                case "left":
                case "right":
                    itemsInGrid = itemsInGrid.sort(NgGridHelper.sortItemsByPositionHorizontal);
                    var lowestColumnPerRow = new Map();
                    for (var _a = 0, itemsInGrid_2 = itemsInGrid; _a < itemsInGrid_2.length; _a++) {
                        var item = itemsInGrid_2[_a];
                        var itemDims = item.getSize();
                        var itemPos = item.getGridPosition();
                        var lowestColumnForItem = lowestColumnPerRow.get(itemPos.row) || 1;
                        for (var i = 1; i < itemDims.y; i++) {
                            var lowestOffsetColumn = lowestColumnPerRow.get(itemPos.row + i) || 1;
                            lowestColumnForItem = Math.max(lowestOffsetColumn, lowestColumnForItem);
                        }
                        var topRow = itemPos.row;
                        var bottomRow = itemPos.row + itemDims.y;
                        if (pos && dims) {
                            var withinRows = bottomRow > pos.col && topRow < (pos.col + dims.x);
                            if (withinRows) { //	If our element is in one of the item's rows
                                var roomNextToItem = itemDims.x <= (pos.col - lowestColumnForItem);
                                if (!roomNextToItem) { //	Item can't fit next to our element
                                    lowestColumnForItem = Math.max(lowestColumnForItem, pos.col + dims.x); //	Set the lowest col to be the other side of it
                                }
                            }
                        }
                        var newPos = { col: lowestColumnForItem, row: itemPos.row };
                        if (lowestColumnForItem !== itemPos.col && this._isWithinBoundsX(newPos, itemDims)) { //	If the item is not already on this col move it up
                            this._removeFromGrid(item);
                            item.setGridPosition(newPos);
                            item.onCascadeEvent();
                            this._addToGrid(item);
                        }
                        for (var i = 0; i < itemDims.y; i++) {
                            lowestColumnPerRow.set(itemPos.row + i, lowestColumnForItem + itemDims.x); //	Update the lowest col to be below the item
                        }
                    }
                    break;
                default:
                    break;
            }
        };
        NgGrid.prototype._fixGridPosition = function (pos, dims) {
            if (!this._hasGridCollision(pos, dims))
                return pos;
            var maxAllowedRows = this._maxRows;
            var maxUsedRows = this._getMaxRow();
            var maxAllowedCols = this._maxCols;
            var maxUsedCols = this._getMaxCol();
            var newPos = {
                col: pos.col,
                row: pos.row,
            };
            if (maxAllowedCols === 0 && dims.y >= maxAllowedRows) {
                //	It's too big to fit alongside any other item, it has to go straight to the top right
                newPos.col = maxUsedCols + 1;
                newPos.row = 1;
            }
            else if (maxAllowedRows === 0 && dims.x >= maxAllowedCols) {
                //	It's too big to fit alongside any other item, it has to go straight to the bottom left
                newPos.row = maxUsedRows + 1;
                newPos.col = 1;
            }
            else if (this._itemFixDirection === "vertical") {
                if (maxAllowedRows === 0) {
                    //	We can keep pushing it down as long as we like
                    //	See if it will fit in any gaps between existing items
                    var itemsInPath = this._getItemsInVerticalPath(newPos, dims, newPos.row);
                    newPos.row = this._getNextFittingRow(newPos, dims, itemsInPath);
                }
                else {
                    //	We can only move down so far, before we need to try putting at the top of the next column
                    //	Luckily, we can push it out as far as we like as maxAllowedCols *must* be 0
                    for (; newPos.col <= maxUsedCols;) {
                        //	See if it will fit in any gaps between existing items in this column
                        var itemsInPath = this._getItemsInVerticalPath(newPos, dims, newPos.row);
                        var nextRow = this._getNextFittingRow(newPos, dims, itemsInPath);
                        //	See if the item will fit somewhere in this row
                        if (maxAllowedRows - nextRow >= dims.y) {
                            newPos.row = nextRow;
                            break;
                        }
                        //	If not, try moving to the top of the column left of the smallest item in our way
                        newPos.col = Math.max(newPos.col + 1, Math.min.apply(Math, itemsInPath.map(function (item) { return item.col + item.sizex; })));
                        newPos.row = 1;
                    }
                }
            }
            else if (this._itemFixDirection === "horizontal") {
                if (maxAllowedCols === 0) {
                    //	We can keep pushing it out as long as we like
                    //	See if it will fit in any gaps between existing items
                    var itemsInPath = this._getItemsInHorizontalPath(newPos, dims, newPos.row);
                    newPos.col = this._getNextFittingCol(newPos, dims, itemsInPath);
                }
                else {
                    //	We can only move out so far, before we need to try putting at the left of the next row
                    //	Luckily, we can push it down as far as we like as maxAllowedRows *must* be 0
                    for (; newPos.row <= maxUsedRows;) {
                        var itemsInPath = this._getItemsInHorizontalPath(newPos, dims, newPos.col);
                        var nextCol = this._getNextFittingCol(newPos, dims, itemsInPath);
                        //	See if the item will fit somewhere in this column
                        if (maxAllowedCols - nextCol >= dims.x) {
                            newPos.col = nextCol;
                            break;
                        }
                        //	If not, try moving to the left of the row below the smallest item in our way
                        newPos.row = Math.max(newPos.row + 1, Math.min.apply(Math, itemsInPath.map(function (item) { return item.row + item.sizey; })));
                        newPos.col = 1;
                    }
                }
            }
            return newPos;
        };
        NgGrid.prototype._getNextFittingRow = function (newPos, dims, itemsInPath) {
            var nextRow = newPos.row;
            for (var _i = 0, itemsInPath_1 = itemsInPath; _i < itemsInPath_1.length; _i++) {
                var item = itemsInPath_1[_i];
                //	Will our item fit in this column between the last item and this one?
                if (item.row - nextRow >= dims.y) {
                    return nextRow;
                }
                //	Store the bottom of this item for the next comparison
                nextRow = item.row + item.sizey;
            }
            return nextRow;
        };
        NgGrid.prototype._getNextFittingCol = function (newPos, dims, itemsInPath) {
            var nextCol = newPos.col;
            for (var _i = 0, itemsInPath_2 = itemsInPath; _i < itemsInPath_2.length; _i++) {
                var item = itemsInPath_2[_i];
                //	Will our item fit in this row between the last item and this one?
                if (item.col - nextCol >= dims.x) {
                    return nextCol;
                }
                //	Store the right of this item for the next comparison
                nextCol = item.col + item.sizex;
            }
            return nextCol;
        };
        NgGrid.prototype._getItemsInHorizontalPath = function (pos, dims, startColumn) {
            var _this = this;
            if (startColumn === void 0) { startColumn = 0; }
            var itemsInPath = [];
            var topRow = pos.row + dims.y - 1;
            this._itemsInGrid.forEach(function (itemId) {
                var item = _this._items.get(itemId);
                if (item.col + item.sizex - 1 < startColumn) {
                    return;
                } //	Item falls after start column
                if (item.row > topRow) {
                    return;
                } //	Item falls above path
                if (item.row + item.sizey - 1 < pos.row) {
                    return;
                } //	Item falls below path
                itemsInPath.push(item);
            });
            return itemsInPath;
        };
        NgGrid.prototype._getItemsInVerticalPath = function (pos, dims, startRow) {
            var _this = this;
            if (startRow === void 0) { startRow = 0; }
            var itemsInPath = [];
            var rightCol = pos.col + dims.x - 1;
            this._itemsInGrid.forEach(function (itemId) {
                var item = _this._items.get(itemId);
                if (item.row + item.sizey - 1 < startRow) {
                    return;
                } //	Item falls above start row
                if (item.col > rightCol) {
                    return;
                } //	Item falls after path
                if (item.col + item.sizex - 1 < pos.col) {
                    return;
                } //	Item falls before path
                itemsInPath.push(item);
            });
            return itemsInPath;
        };
        NgGrid.prototype._isWithinBoundsX = function (pos, dims, allowExcessiveItems) {
            if (allowExcessiveItems === void 0) { allowExcessiveItems = false; }
            return this._maxCols === 0 || (allowExcessiveItems && pos.col === 1) || (pos.col + dims.x - 1) <= this._maxCols;
        };
        NgGrid.prototype._fixPosToBoundsX = function (pos, dims) {
            if (!this._isWithinBoundsX(pos, dims)) {
                pos.col = Math.max(this._maxCols - (dims.x - 1), 1);
                pos.row++;
            }
            return pos;
        };
        NgGrid.prototype._fixSizeToBoundsX = function (pos, dims) {
            if (!this._isWithinBoundsX(pos, dims)) {
                dims.x = Math.max(this._maxCols - (pos.col - 1), 1);
                dims.y++;
            }
            return dims;
        };
        NgGrid.prototype._isWithinBoundsY = function (pos, dims, allowExcessiveItems) {
            if (allowExcessiveItems === void 0) { allowExcessiveItems = false; }
            return this._maxRows === 0 || (allowExcessiveItems && pos.row === 1) || (pos.row + dims.y - 1) <= this._maxRows;
        };
        NgGrid.prototype._fixPosToBoundsY = function (pos, dims) {
            if (!this._isWithinBoundsY(pos, dims)) {
                pos.row = Math.max(this._maxRows - (dims.y - 1), 1);
                pos.col++;
            }
            return pos;
        };
        NgGrid.prototype._fixSizeToBoundsY = function (pos, dims) {
            if (!this._isWithinBoundsY(pos, dims)) {
                dims.y = Math.max(this._maxRows - (pos.row - 1), 1);
                dims.x++;
            }
            return dims;
        };
        NgGrid.prototype._isWithinBounds = function (pos, dims, allowExcessiveItems) {
            if (allowExcessiveItems === void 0) { allowExcessiveItems = false; }
            return this._isWithinBoundsX(pos, dims, allowExcessiveItems) && this._isWithinBoundsY(pos, dims, allowExcessiveItems);
        };
        NgGrid.prototype._fixPosToBounds = function (pos, dims) {
            return this._fixPosToBoundsX(this._fixPosToBoundsY(pos, dims), dims);
        };
        NgGrid.prototype._fixSizeToBounds = function (pos, dims) {
            return this._fixSizeToBoundsX(pos, this._fixSizeToBoundsY(pos, dims));
        };
        NgGrid.prototype._addToGrid = function (item) {
            var pos = item.getGridPosition();
            var dims = item.getSize();
            if (this._hasGridCollision(pos, dims)) {
                this._fixGridCollisions(pos, dims);
                pos = item.getGridPosition();
            }
            if (this._allowOverlap) {
                item.zIndex = this._lastZValue++;
            }
            this._itemsInGrid.add(item.uid);
        };
        NgGrid.prototype._removeFromGrid = function (item) {
            this._itemsInGrid.delete(item.uid);
        };
        NgGrid.prototype._updateSize = function () {
            if (this._destroyed)
                return;
            var maxCol = this._getMaxCol();
            var maxRow = this._getMaxRow();
            if (maxCol !== this._curMaxCol || maxRow !== this._curMaxRow) {
                this._curMaxCol = maxCol;
                this._curMaxRow = maxRow;
            }
            this._renderer.setElementStyle(this._ngEl.nativeElement, "width", "100%"); // (maxCol * (this.colWidth + this.marginLeft + this.marginRight))+'px');
            if (!this._elementBasedDynamicRowHeight) {
                this._renderer.setElementStyle(this._ngEl.nativeElement, "height", (maxRow * (this.rowHeight + this.marginTop + this.marginBottom)) + "px");
            }
        };
        NgGrid.prototype._getMaxRow = function () {
            var _this = this;
            var itemsRows = Array.from(this._itemsInGrid, function (itemId) {
                var item = _this._items.get(itemId);
                if (!item)
                    return 0;
                return item.row + item.sizey - 1;
            });
            return Math.max.apply(null, itemsRows);
        };
        NgGrid.prototype._getMaxCol = function () {
            var _this = this;
            var itemsCols = Array.from(this._itemsInGrid, function (itemId) {
                var item = _this._items.get(itemId);
                if (!item)
                    return 0;
                return item.col + item.sizex - 1;
            });
            return Math.max.apply(null, itemsCols);
        };
        NgGrid.prototype._getMousePosition = function (e) {
            if ((window.TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
                e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
            }
            var refPos = this._ngEl.nativeElement.getBoundingClientRect();
            var left = e.clientX - refPos.left;
            var top = e.clientY - refPos.top;
            if (this.cascade === "down")
                top = refPos.top + refPos.height - e.clientY;
            if (this.cascade === "right")
                left = refPos.left + refPos.width - e.clientX;
            if (this.isDragging && this._zoomOnDrag) {
                left *= 2;
                top *= 2;
            }
            return {
                left: left,
                top: top,
            };
        };
        NgGrid.prototype._getAbsoluteMousePosition = function (e) {
            if ((window.TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
                e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
            }
            return {
                left: e.clientX,
                top: e.clientY,
            };
        };
        NgGrid.prototype._getContainerColumns = function () {
            var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
            var itemWidth = this.colWidth + this.marginLeft + this.marginRight;
            return Math.floor(maxWidth / itemWidth);
        };
        NgGrid.prototype._getContainerRows = function () {
            var maxHeight = window.innerHeight - this.marginTop - this.marginBottom;
            return Math.floor(maxHeight / (this.rowHeight + this.marginTop + this.marginBottom));
        };
        NgGrid.prototype._getScreenMargin = function () {
            var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
            var itemWidth = this.colWidth + this.marginLeft + this.marginRight;
            return Math.floor((maxWidth - (this._maxCols * itemWidth)) / 2);
        };
        NgGrid.prototype._getItemFromPosition = function (position) {
            var _this = this;
            return Array.from(this._itemsInGrid, function (itemId) { return _this._items.get(itemId); })
                .sort(function (a, b) { return b.zIndex - a.zIndex; })
                .find(function (item) {
                if (!item)
                    return false;
                var size = item.getDimensions();
                var pos = item.getPosition();
                // tslint:disable-next-line:indent
                return position.left >= pos.left && position.left < (pos.left + size.width) &&
                    position.top >= pos.top && position.top < (pos.top + size.height);
            });
        };
        NgGrid.prototype._createPlaceholder = function (item) {
            var pos = item.getGridPosition();
            var dims = item.getSize();
            var factory = this.componentFactoryResolver.resolveComponentFactory(NgGridPlaceholder);
            var componentRef = item.containerRef.createComponent(factory);
            this._placeholderRef = componentRef;
            var placeholder = componentRef.instance;
            placeholder.registerGrid(this);
            placeholder.setCascadeMode(this.cascade);
            placeholder.setGridPosition({ col: pos.col, row: pos.row });
            placeholder.setSize({ x: dims.x, y: dims.y });
        };
        NgGrid.prototype._emitOnItemChange = function () {
            var _this = this;
            var itemOutput = Array.from(this._itemsInGrid)
                .map(function (itemId) { return _this._items.get(itemId); })
                .filter(function (item) { return !!item; })
                .map(function (item) { return item.getEventOutput(); });
            this.onItemChange.emit(itemOutput);
        };
        NgGrid.prototype._defineListeners = function () {
            var element = this._ngEl.nativeElement;
            this._documentMousemove$ = rxjs.fromEvent(document, "mousemove");
            this._documentMouseup$ = rxjs.fromEvent(document, "mouseup");
            this._mousedown$ = rxjs.fromEvent(element, "mousedown");
            this._mousemove$ = rxjs.fromEvent(element, "mousemove");
            this._mouseup$ = rxjs.fromEvent(element, "mouseup");
            this._touchstart$ = rxjs.fromEvent(element, "touchstart");
            this._touchmove$ = rxjs.fromEvent(element, "touchmove");
            this._touchend$ = rxjs.fromEvent(element, "touchend");
        };
        NgGrid.prototype._enableListeners = function () {
            if (this._enabledListener) {
                return;
            }
            this._enableMouseListeners();
            if (this._isTouchDevice()) {
                this._enableTouchListeners();
            }
            this._enabledListener = true;
        };
        NgGrid.prototype._disableListeners = function () {
            this._subscriptions.forEach(function (subs) { return subs.unsubscribe(); });
            this._enabledListener = false;
        };
        NgGrid.prototype._isTouchDevice = function () {
            return "ontouchstart" in window || navigator.maxTouchPoints > 0;
        };
        NgGrid.prototype._enableTouchListeners = function () {
            var _this = this;
            var touchstartSubs = this._touchstart$.subscribe(function (e) { return _this.mouseDownEventHandler(e); });
            var touchmoveSubs = this._touchmove$.subscribe(function (e) { return _this.mouseMoveEventHandler(e); });
            var touchendSubs = this._touchend$.subscribe(function (e) { return _this.mouseUpEventHandler(e); });
            this._subscriptions.push(touchstartSubs, touchmoveSubs, touchendSubs);
        };
        NgGrid.prototype._enableMouseListeners = function () {
            var _this = this;
            var documentMousemoveSubs = this._documentMousemove$.subscribe(function (e) { return _this.mouseMoveEventHandler(e); });
            var documentMouseupSubs = this._documentMouseup$.subscribe(function (e) { return _this.mouseUpEventHandler(e); });
            var mousedownSubs = this._mousedown$.subscribe(function (e) { return _this.mouseDownEventHandler(e); });
            var mousemoveSubs = this._mousemove$.subscribe(function (e) { return _this.mouseMoveEventHandler(e); });
            var mouseupSubs = this._mouseup$.subscribe(function (e) { return _this.mouseUpEventHandler(e); });
            this._subscriptions.push(documentMousemoveSubs, documentMouseupSubs, mousedownSubs, mousemoveSubs, mouseupSubs);
        };
        NgGrid.CONST_DEFAULT_RESIZE_DIRECTIONS = [
            "bottomright",
            "bottomleft",
            "topright",
            "topleft",
            "right",
            "left",
            "bottom",
            "top",
        ];
        //	Default config
        // tslint:disable:object-literal-sort-keys
        // tslint:disable-next-line:member-ordering
        NgGrid.CONST_DEFAULT_CONFIG = {
            margins: [10],
            draggable: true,
            resizable: true,
            max_cols: 0,
            max_rows: 0,
            visible_cols: 0,
            visible_rows: 0,
            col_width: 250,
            row_height: 250,
            cascade: "up",
            min_width: 100,
            min_height: 100,
            fix_to_grid: false,
            auto_style: true,
            auto_resize: false,
            maintain_ratio: false,
            prefer_new: false,
            zoom_on_drag: false,
            limit_to_screen: false,
            center_to_screen: false,
            resize_directions: NgGrid.CONST_DEFAULT_RESIZE_DIRECTIONS,
            element_based_row_height: false,
            fix_item_position_direction: "cascade",
            fix_collision_position_direction: "cascade",
            allow_overlap: false,
        };
        NgGrid.decorators = [
            { type: core.Directive, args: [{
                        host: {
                            "(window:resize)": "resizeEventHandler($event)",
                        },
                        inputs: ["config: ngGrid"],
                        selector: "[ngGrid]",
                    },] },
        ];
        /** @nocollapse */
        NgGrid.ctorParameters = function () { return [
            { type: core.KeyValueDiffers },
            { type: core.ElementRef },
            { type: core.Renderer },
            { type: core.ComponentFactoryResolver }
        ]; };
        NgGrid.propDecorators = {
            onDragStart: [{ type: core.Output }],
            onDrag: [{ type: core.Output }],
            onDragStop: [{ type: core.Output }],
            onResizeStart: [{ type: core.Output }],
            onResize: [{ type: core.Output }],
            onResizeStop: [{ type: core.Output }],
            onItemChange: [{ type: core.Output }]
        };
        return NgGrid;
    }());

    var NgGridItem = /** @class */ (function () {
        //	Constructor
        function NgGridItem(_differs, _ngEl, _renderer, _ngGrid, containerRef) {
            this._differs = _differs;
            this._ngEl = _ngEl;
            this._renderer = _renderer;
            this._ngGrid = _ngGrid;
            this.containerRef = containerRef;
            //	Event Emitters
            this.onItemChange = new core.EventEmitter(false);
            this.onDragStart = new core.EventEmitter();
            this.onDrag = new core.EventEmitter();
            this.onDragStop = new core.EventEmitter();
            this.onDragAny = new core.EventEmitter();
            this.onResizeStart = new core.EventEmitter();
            this.onResize = new core.EventEmitter();
            this.onResizeStop = new core.EventEmitter();
            this.onResizeAny = new core.EventEmitter();
            this.onChangeStart = new core.EventEmitter();
            this.onChange = new core.EventEmitter();
            this.onChangeStop = new core.EventEmitter();
            this.onChangeAny = new core.EventEmitter();
            this.ngGridItemChange = new core.EventEmitter();
            // tslint:enable:object-literal-sort-keys
            this.isFixed = false;
            this.isDraggable = true;
            this.isResizable = true;
            this.minWidth = 0;
            this.minHeight = 0;
            this.uid = null;
            this._currentPosition = { col: 1, row: 1 };
            this._size = { x: 1, y: 1 };
            this._config = NgGridItem.CONST_DEFAULT_CONFIG;
            this._userConfig = null;
            this._dragHandle = null;
            this._resizeHandle = null;
            this._borderSize = 25;
            this._added = false;
            this._maxCols = 0;
            this._minCols = 0;
            this._maxRows = 0;
            this._minRows = 0;
            this._resizeDirections = [];
            this._zIndex = 0;
        }
        Object.defineProperty(NgGridItem.prototype, "zIndex", {
            get: function () {
                return this._zIndex;
            },
            set: function (zIndex) {
                this._renderer.setElementStyle(this._ngEl.nativeElement, "z-index", zIndex.toString());
                this._zIndex = zIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgGridItem.prototype, "config", {
            //	[ng-grid-item] handler
            set: function (v) {
                this._userConfig = v;
                var configObject = Object.assign({}, NgGridItem.CONST_DEFAULT_CONFIG, v);
                for (var x in NgGridItem.CONST_DEFAULT_CONFIG)
                    if (configObject[x] == null)
                        configObject[x] = NgGridItem.CONST_DEFAULT_CONFIG[x];
                this.setConfig(configObject);
                if (this._userConfig != null) {
                    if (this._differ == null) {
                        this._differ = this._differs.find(this._userConfig).create();
                    }
                    this._differ.diff(this._userConfig);
                }
                if (!this._added) {
                    this._added = true;
                    this._ngGrid.addItem(this);
                }
                this._recalculateDimensions();
                this._recalculatePosition();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgGridItem.prototype, "sizex", {
            get: function () {
                return this._size.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgGridItem.prototype, "sizey", {
            get: function () {
                return this._size.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgGridItem.prototype, "col", {
            get: function () {
                return this._currentPosition.col;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgGridItem.prototype, "row", {
            get: function () {
                return this._currentPosition.row;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgGridItem.prototype, "currentCol", {
            get: function () {
                return this._currentPosition.col;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgGridItem.prototype, "currentRow", {
            get: function () {
                return this._currentPosition.row;
            },
            enumerable: true,
            configurable: true
        });
        NgGridItem.prototype.onResizeStartEvent = function () {
            var event = this.getEventOutput();
            this.onResizeStart.emit(event);
            this.onResizeAny.emit(event);
            this.onChangeStart.emit(event);
            this.onChangeAny.emit(event);
        };
        NgGridItem.prototype.onResizeEvent = function () {
            var event = this.getEventOutput();
            this.onResize.emit(event);
            this.onResizeAny.emit(event);
            this.onChange.emit(event);
            this.onChangeAny.emit(event);
        };
        NgGridItem.prototype.onResizeStopEvent = function () {
            var event = this.getEventOutput();
            this.onResizeStop.emit(event);
            this.onResizeAny.emit(event);
            this.onChangeStop.emit(event);
            this.onChangeAny.emit(event);
            this.onConfigChangeEvent();
        };
        NgGridItem.prototype.onDragStartEvent = function () {
            var event = this.getEventOutput();
            this.onDragStart.emit(event);
            this.onDragAny.emit(event);
            this.onChangeStart.emit(event);
            this.onChangeAny.emit(event);
        };
        NgGridItem.prototype.onDragEvent = function () {
            var event = this.getEventOutput();
            this.onDrag.emit(event);
            this.onDragAny.emit(event);
            this.onChange.emit(event);
            this.onChangeAny.emit(event);
        };
        NgGridItem.prototype.onDragStopEvent = function () {
            var event = this.getEventOutput();
            this.onDragStop.emit(event);
            this.onDragAny.emit(event);
            this.onChangeStop.emit(event);
            this.onChangeAny.emit(event);
            this.onConfigChangeEvent();
        };
        NgGridItem.prototype.onCascadeEvent = function () {
            this.onConfigChangeEvent();
        };
        NgGridItem.prototype.ngOnInit = function () {
            this._renderer.setElementClass(this._ngEl.nativeElement, "grid-item", true);
            if (this._ngGrid.autoStyle)
                this._renderer.setElementStyle(this._ngEl.nativeElement, "position", "absolute");
            this._recalculateDimensions();
            this._recalculatePosition();
            if (!this._added) {
                this._added = true;
                this._ngGrid.addItem(this);
            }
        };
        //	Public methods
        NgGridItem.prototype.canDrag = function (e) {
            if (!this.isDraggable)
                return false;
            if (this._dragHandle) {
                return this.findHandle(this._dragHandle, e.target);
            }
            return true;
        };
        NgGridItem.prototype.findHandle = function (handleSelector, startElement) {
            try {
                var targetElem = startElement;
                while (targetElem && targetElem !== this._ngEl.nativeElement) {
                    if (this.elementMatches(targetElem, handleSelector))
                        return true;
                    targetElem = targetElem.parentElement;
                }
            }
            catch (err) { } // tslint:disable-line:no-empty
            return false;
        };
        NgGridItem.prototype.canResize = function (e) {
            if (!this.isResizable)
                return null;
            if (this._resizeHandle) {
                if (typeof this._resizeHandle === "string") {
                    return this.findHandle(this._resizeHandle, e.target) ? "bottomright" : null;
                }
                if (typeof this._resizeHandle !== "object")
                    return null;
                for (var _i = 0, _a = this._resizeDirections; _i < _a.length; _i++) {
                    var direction = _a[_i];
                    if (direction in this._resizeHandle) {
                        if (this.findHandle(this._resizeHandle[direction], e.target)) {
                            return direction;
                        }
                    }
                }
                return null;
            }
            if (this._borderSize <= 0)
                return null;
            var mousePos = this._getMousePosition(e);
            for (var _b = 0, _c = this._resizeDirections; _b < _c.length; _b++) {
                var direction = _c[_b];
                if (this.canResizeInDirection(direction, mousePos)) {
                    return direction;
                }
            }
            return null;
        };
        NgGridItem.prototype.onMouseMove = function (e) {
            if (this._ngGrid.autoStyle) {
                if (this._ngGrid.resizeEnable) {
                    var resizeDirection = this.canResize(e);
                    var cursor = "default";
                    switch (resizeDirection) {
                        case "bottomright":
                        case "topleft":
                            cursor = "nwse-resize";
                            break;
                        case "topright":
                        case "bottomleft":
                            cursor = "nesw-resize";
                            break;
                        case "top":
                        case "bottom":
                            cursor = "ns-resize";
                            break;
                        case "left":
                        case "right":
                            cursor = "ew-resize";
                            break;
                        default:
                            if (this._ngGrid.dragEnable && this.canDrag(e)) {
                                cursor = "move";
                            }
                            break;
                    }
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "cursor", cursor);
                }
                else if (this._ngGrid.dragEnable && this.canDrag(e)) {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "cursor", "move");
                }
                else {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "cursor", "default");
                }
            }
        };
        NgGridItem.prototype.ngOnDestroy = function () {
            if (this._added)
                this._ngGrid.removeItem(this);
        };
        //	Getters
        NgGridItem.prototype.getElement = function () {
            return this._ngEl;
        };
        NgGridItem.prototype.getDragHandle = function () {
            return this._dragHandle;
        };
        NgGridItem.prototype.getResizeHandle = function () {
            return this._resizeHandle;
        };
        NgGridItem.prototype.getDimensions = function () {
            return { width: this._elemWidth, height: this._elemHeight };
        };
        NgGridItem.prototype.getSize = function () {
            return this._size;
        };
        NgGridItem.prototype.getPosition = function () {
            return { left: this._elemLeft, top: this._elemTop };
        };
        NgGridItem.prototype.getGridPosition = function () {
            return this._currentPosition;
        };
        //	Setters
        NgGridItem.prototype.setConfig = function (config) {
            this._config = config;
            this._payload = config.payload;
            this._currentPosition.col = config.col ? config.col : NgGridItem.CONST_DEFAULT_CONFIG.col;
            this._currentPosition.row = config.row ? config.row : NgGridItem.CONST_DEFAULT_CONFIG.row;
            this._size.x = config.sizex ? config.sizex : NgGridItem.CONST_DEFAULT_CONFIG.sizex;
            this._size.y = config.sizey ? config.sizey : NgGridItem.CONST_DEFAULT_CONFIG.sizey;
            this._dragHandle = config.dragHandle;
            this._resizeHandle = config.resizeHandle;
            this._borderSize = config.borderSize;
            this.isDraggable = config.draggable ? true : false;
            this.isResizable = config.resizable ? true : false;
            this.isFixed = config.fixed ? true : false;
            this._resizeDirections = config.resizeDirections || this._ngGrid.resizeDirections;
            this._maxCols = !isNaN(config.maxCols) && isFinite(config.maxCols) ? config.maxCols : 0;
            this._minCols = !isNaN(config.minCols) && isFinite(config.minCols) ? config.minCols : 0;
            this._maxRows = !isNaN(config.maxRows) && isFinite(config.maxRows) ? config.maxRows : 0;
            this._minRows = !isNaN(config.minRows) && isFinite(config.minRows) ? config.minRows : 0;
            this.minWidth = !isNaN(config.minWidth) && isFinite(config.minWidth) ? config.minWidth : 0;
            this.minHeight = !isNaN(config.minHeight) && isFinite(config.minHeight) ? config.minHeight : 0;
            if (this._minCols > 0 && this._maxCols > 0 && this._minCols > this._maxCols)
                this._minCols = 0;
            if (this._minRows > 0 && this._maxRows > 0 && this._minRows > this._maxRows)
                this._minRows = 0;
            if (this._added) {
                this._ngGrid.updateItem(this);
            }
            this._size = this.fixResize(this._size);
            this._recalculatePosition();
            this._recalculateDimensions();
        };
        NgGridItem.prototype.ngDoCheck = function () {
            if (this._differ != null) {
                var changes = this._differ.diff(this._userConfig);
                if (changes != null) {
                    return this._applyChanges(changes);
                }
            }
            return false;
        };
        NgGridItem.prototype.setSize = function (newSize, update) {
            if (update === void 0) { update = true; }
            newSize = this.fixResize(newSize);
            this._size = newSize;
            if (update)
                this._recalculateDimensions();
            this.onItemChange.emit(this.getEventOutput());
        };
        NgGridItem.prototype.setGridPosition = function (gridPosition, update) {
            if (update === void 0) { update = true; }
            this._currentPosition = gridPosition;
            if (update)
                this._recalculatePosition();
            this.onItemChange.emit(this.getEventOutput());
        };
        NgGridItem.prototype.getEventOutput = function () {
            return {
                col: this._currentPosition.col,
                height: this._elemHeight,
                left: this._elemLeft,
                payload: this._payload,
                row: this._currentPosition.row,
                sizex: this._size.x,
                sizey: this._size.y,
                top: this._elemTop,
                uid: this.uid,
                width: this._elemWidth,
            };
        };
        NgGridItem.prototype.setPosition = function (x, y) {
            switch (this._cascadeMode) {
                case "up":
                case "left":
                default:
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "left", x + "px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "top", y + "px");
                    break;
                case "right":
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "right", x + "px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "top", y + "px");
                    break;
                case "down":
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "left", x + "px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "bottom", y + "px");
                    break;
            }
            this._elemLeft = x;
            this._elemTop = y;
        };
        NgGridItem.prototype.setCascadeMode = function (cascade) {
            this._cascadeMode = cascade;
            switch (cascade) {
                case "up":
                case "left":
                default:
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "left", this._elemLeft + "px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "top", this._elemTop + "px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "right", null);
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "bottom", null);
                    break;
                case "right":
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "right", this._elemLeft + "px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "top", this._elemTop + "px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "left", null);
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "bottom", null);
                    break;
                case "down":
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "left", this._elemLeft + "px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "bottom", this._elemTop + "px");
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "right", null);
                    this._renderer.setElementStyle(this._ngEl.nativeElement, "top", null);
                    break;
            }
        };
        NgGridItem.prototype.setDimensions = function (w, h) {
            if (w < this.minWidth)
                w = this.minWidth;
            if (h < this.minHeight)
                h = this.minHeight;
            this._renderer.setElementStyle(this._ngEl.nativeElement, "width", w + "px");
            this._renderer.setElementStyle(this._ngEl.nativeElement, "height", h + "px");
            this._elemWidth = w;
            this._elemHeight = h;
        };
        NgGridItem.prototype.startMoving = function () {
            this._renderer.setElementClass(this._ngEl.nativeElement, "moving", true);
            var style = window.getComputedStyle(this._ngEl.nativeElement);
            if (this._ngGrid.autoStyle)
                this._renderer.setElementStyle(this._ngEl.nativeElement, "z-index", (parseInt(style.getPropertyValue("z-index"), 10) + 1).toString());
        };
        NgGridItem.prototype.stopMoving = function () {
            this._renderer.setElementClass(this._ngEl.nativeElement, "moving", false);
            var style = window.getComputedStyle(this._ngEl.nativeElement);
            if (this._ngGrid.autoStyle)
                this._renderer.setElementStyle(this._ngEl.nativeElement, "z-index", (parseInt(style.getPropertyValue("z-index"), 10) - 1).toString());
        };
        NgGridItem.prototype.recalculateSelf = function () {
            this._recalculatePosition();
            this._recalculateDimensions();
        };
        NgGridItem.prototype.fixResize = function (newSize) {
            if (this._maxCols > 0 && newSize.x > this._maxCols)
                newSize.x = this._maxCols;
            if (this._maxRows > 0 && newSize.y > this._maxRows)
                newSize.y = this._maxRows;
            if (this._minCols > 0 && newSize.x < this._minCols)
                newSize.x = this._minCols;
            if (this._minRows > 0 && newSize.y < this._minRows)
                newSize.y = this._minRows;
            var itemWidth = (newSize.x * this._ngGrid.colWidth) + ((this._ngGrid.marginLeft + this._ngGrid.marginRight) * (newSize.x - 1));
            if (itemWidth < this.minWidth)
                newSize.x = Math.ceil((this.minWidth + this._ngGrid.marginRight + this._ngGrid.marginLeft) / (this._ngGrid.colWidth + this._ngGrid.marginRight + this._ngGrid.marginLeft));
            var itemHeight = (newSize.y * this._ngGrid.rowHeight) + ((this._ngGrid.marginTop + this._ngGrid.marginBottom) * (newSize.y - 1));
            if (itemHeight < this.minHeight)
                newSize.y = Math.ceil((this.minHeight + this._ngGrid.marginBottom + this._ngGrid.marginTop) / (this._ngGrid.rowHeight + this._ngGrid.marginBottom + this._ngGrid.marginTop));
            return newSize;
        };
        //	Private methods
        NgGridItem.prototype.elementMatches = function (element, selector) {
            if (!element)
                return false;
            if (element.matches)
                return element.matches(selector);
            if (element.oMatchesSelector)
                return element.oMatchesSelector(selector);
            if (element.msMatchesSelector)
                return element.msMatchesSelector(selector);
            if (element.mozMatchesSelector)
                return element.mozMatchesSelector(selector);
            if (element.webkitMatchesSelector)
                return element.webkitMatchesSelector(selector);
            if (!element.document || !element.ownerDocument)
                return false;
            var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
            for (var i = matches.length - 1; i >= 0; i--) {
                if (matches.item(i) === element) {
                    return true;
                }
            }
            return false;
        };
        NgGridItem.prototype._recalculatePosition = function () {
            var x = (this._ngGrid.colWidth + this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._currentPosition.col - 1) + this._ngGrid.marginLeft + this._ngGrid.screenMargin;
            var y = (this._ngGrid.rowHeight + this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._currentPosition.row - 1) + this._ngGrid.marginTop;
            this.setPosition(x, y);
        };
        NgGridItem.prototype._recalculateDimensions = function () {
            if (this._size.x < this._ngGrid.minCols)
                this._size.x = this._ngGrid.minCols;
            if (this._size.y < this._ngGrid.minRows)
                this._size.y = this._ngGrid.minRows;
            var newWidth = (this._ngGrid.colWidth * this._size.x) + ((this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._size.x - 1));
            var newHeight = (this._ngGrid.rowHeight * this._size.y) + ((this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._size.y - 1));
            var w = Math.max(this.minWidth, this._ngGrid.minWidth, newWidth);
            var h = Math.max(this.minHeight, this._ngGrid.minHeight, newHeight);
            this.setDimensions(w, h);
        };
        NgGridItem.prototype._getMousePosition = function (e) {
            if (e.originalEvent && e.originalEvent.touches) {
                var oe = e.originalEvent;
                e = oe.touches.length ? oe.touches[0] : (oe.changedTouches.length ? oe.changedTouches[0] : e);
            }
            else if (e.touches) {
                e = e.touches.length ? e.touches[0] : (e.changedTouches.length ? e.changedTouches[0] : e);
            }
            var refPos = this._ngEl.nativeElement.getBoundingClientRect();
            return {
                left: e.clientX - refPos.left,
                top: e.clientY - refPos.top,
            };
        };
        NgGridItem.prototype._applyChanges = function (changes) {
            var _this = this;
            var changed = false;
            var changeCheck = function (record) {
                if (_this._config[record.key] !== record.currentValue) {
                    _this._config[record.key] = record.currentValue;
                    changed = true;
                }
            };
            changes.forEachAddedItem(changeCheck);
            changes.forEachChangedItem(changeCheck);
            changes.forEachRemovedItem(function (record) {
                changed = true;
                delete _this._config[record.key];
            });
            if (changed) {
                this.setConfig(this._config);
            }
            return changed;
        };
        NgGridItem.prototype.onConfigChangeEvent = function () {
            if (this._userConfig === null)
                return;
            this._config.sizex = this._userConfig.sizex = this._size.x;
            this._config.sizey = this._userConfig.sizey = this._size.y;
            this._config.col = this._userConfig.col = this._currentPosition.col;
            this._config.row = this._userConfig.row = this._currentPosition.row;
            this.ngGridItemChange.emit(this._userConfig);
        };
        NgGridItem.prototype.canResizeInDirection = function (direction, mousePos) {
            switch (direction) {
                case "bottomright":
                    return mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize
                        && mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize; // tslint:disable-line:indent
                case "bottomleft":
                    return mousePos.left < this._borderSize && mousePos.top < this._elemHeight
                        && mousePos.top > this._elemHeight - this._borderSize; // tslint:disable-line:indent
                case "topright":
                    return mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize
                        && mousePos.top < this._borderSize; // tslint:disable-line:indent
                case "topleft":
                    return mousePos.left < this._borderSize && mousePos.top < this._borderSize;
                case "right":
                    return mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize;
                case "left":
                    return mousePos.left < this._borderSize;
                case "bottom":
                    return mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize;
                case "top":
                    return mousePos.top < this._borderSize;
                default:
                    return false;
            }
        };
        //	Default config
        // tslint:disable:object-literal-sort-keys
        // tslint:disable-next-line:member-ordering
        NgGridItem.CONST_DEFAULT_CONFIG = {
            uid: null,
            col: 1,
            row: 1,
            sizex: 1,
            sizey: 1,
            dragHandle: null,
            resizeHandle: null,
            fixed: false,
            draggable: true,
            resizable: true,
            borderSize: 25,
            resizeDirections: null,
        };
        NgGridItem.decorators = [
            { type: core.Directive, args: [{
                        inputs: ["config: ngGridItem"],
                        selector: "[ngGridItem]",
                    },] },
        ];
        /** @nocollapse */
        NgGridItem.ctorParameters = function () { return [
            { type: core.KeyValueDiffers },
            { type: core.ElementRef },
            { type: core.Renderer },
            { type: NgGrid },
            { type: core.ViewContainerRef }
        ]; };
        NgGridItem.propDecorators = {
            onItemChange: [{ type: core.Output }],
            onDragStart: [{ type: core.Output }],
            onDrag: [{ type: core.Output }],
            onDragStop: [{ type: core.Output }],
            onDragAny: [{ type: core.Output }],
            onResizeStart: [{ type: core.Output }],
            onResize: [{ type: core.Output }],
            onResizeStop: [{ type: core.Output }],
            onResizeAny: [{ type: core.Output }],
            onChangeStart: [{ type: core.Output }],
            onChange: [{ type: core.Output }],
            onChangeStop: [{ type: core.Output }],
            onChangeAny: [{ type: core.Output }],
            ngGridItemChange: [{ type: core.Output }]
        };
        return NgGridItem;
    }());

    var NgGridModule = /** @class */ (function () {
        function NgGridModule() {
        }
        NgGridModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [NgGrid, NgGridItem, NgGridPlaceholder],
                        entryComponents: [NgGridPlaceholder],
                        exports: [NgGrid, NgGridItem],
                    },] },
        ];
        return NgGridModule;
    }());

    exports.NgGrid = NgGrid;
    exports.NgGridItem = NgGridItem;
    exports.NgGridPlaceholder = NgGridPlaceholder;
    exports.NgGridModule = NgGridModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
