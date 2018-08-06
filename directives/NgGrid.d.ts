import { ElementRef, Renderer, EventEmitter, ComponentFactoryResolver, KeyValueDiffers, OnInit, OnDestroy, DoCheck } from "@angular/core";
import { NgGridConfig, NgGridItemEvent, NgGridItemPosition, NgGridItemSize } from "../interfaces/INgGrid";
import { NgGridItem } from "./NgGridItem";
export declare class NgGrid implements OnInit, DoCheck, OnDestroy {
    private _differs;
    private _ngEl;
    private _renderer;
    private componentFactoryResolver;
    static CONST_DEFAULT_RESIZE_DIRECTIONS: string[];
    onDragStart: EventEmitter<NgGridItem>;
    onDrag: EventEmitter<NgGridItem>;
    onDragStop: EventEmitter<NgGridItem>;
    onResizeStart: EventEmitter<NgGridItem>;
    onResize: EventEmitter<NgGridItem>;
    onResizeStop: EventEmitter<NgGridItem>;
    onItemChange: EventEmitter<NgGridItemEvent[]>;
    colWidth: number;
    rowHeight: number;
    minCols: number;
    minRows: number;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    screenMargin: number;
    isDragging: boolean;
    isResizing: boolean;
    autoStyle: boolean;
    resizeEnable: boolean;
    dragEnable: boolean;
    cascade: string;
    minWidth: number;
    minHeight: number;
    resizeDirections: string[];
    private _items;
    private _draggingItem;
    private _resizingItem;
    private _resizeDirection;
    private _itemsInGrid;
    private _maxCols;
    private _maxRows;
    private _visibleCols;
    private _visibleRows;
    private _posOffset;
    private _placeholderRef;
    private _fixToGrid;
    private _autoResize;
    private _differ;
    private _destroyed;
    private _maintainRatio;
    private _aspectRatio;
    private _preferNew;
    private _zoomOnDrag;
    private _limitToScreen;
    private _centerToScreen;
    private _curMaxRow;
    private _curMaxCol;
    private _dragReady;
    private _resizeReady;
    private _elementBasedDynamicRowHeight;
    private _itemFixDirection;
    private _collisionFixDirection;
    private _allowOverlap;
    private _cascadePromise;
    private _lastZValue;
    private _documentMousemove$;
    private _documentMouseup$;
    private _mousedown$;
    private _mousemove$;
    private _mouseup$;
    private _touchstart$;
    private _touchmove$;
    private _touchend$;
    private _subscriptions;
    private _enabledListener;
    private static CONST_DEFAULT_CONFIG;
    private _config;
    config: NgGridConfig;
    constructor(_differs: KeyValueDiffers, _ngEl: ElementRef, _renderer: Renderer, componentFactoryResolver: ComponentFactoryResolver);
    ngOnInit(): void;
    ngOnDestroy(): void;
    generateItemUid(): string;
    setConfig(config: NgGridConfig): void;
    getItemPosition(itemId: string): NgGridItemPosition;
    getItemSize(itemId: string): NgGridItemSize;
    ngDoCheck(): boolean;
    setMargins(margins: string[]): void;
    enableDrag(): void;
    disableDrag(): void;
    enableResize(): void;
    disableResize(): void;
    addItem(ngItem: NgGridItem): void;
    removeItem(ngItem: NgGridItem): void;
    updateItem(ngItem: NgGridItem): void;
    triggerCascade(): Promise<void>;
    triggerResize(): void;
    resizeEventHandler(e: any): void;
    mouseDownEventHandler(e: MouseEvent | TouchEvent): void;
    mouseUpEventHandler(e: MouseEvent | TouchEvent | Event): void;
    mouseMoveEventHandler(e: MouseEvent | TouchEvent | Event): void;
    private _getFixDirectionFromCascade();
    private _updatePositionsAfterMaxChange();
    private _calculateColWidth();
    private _calculateRowHeight();
    private _updateRatio();
    private _applyChanges(changes);
    private _resizeStart(e);
    private _dragStart(e);
    private _zoomOut();
    private _resetZoom();
    private _drag(e);
    private _resize(e);
    private _dragStop(e);
    private _resizeStop(e);
    private _cleanDrag();
    private _cleanResize();
    private _calculateGridSize(width, height);
    private _calculateGridPosition(left, top);
    private _hasGridCollision(pos, dims);
    private _getCollisions(pos, dims);
    private _fixGridCollisions(pos, dims);
    private _cascadeGrid(pos?, dims?);
    private _fixGridPosition(pos, dims);
    private _getNextFittingRow(newPos, dims, itemsInPath);
    private _getNextFittingCol(newPos, dims, itemsInPath);
    private _getItemsInHorizontalPath(pos, dims, startColumn?);
    private _getItemsInVerticalPath(pos, dims, startRow?);
    private _isWithinBoundsX(pos, dims, allowExcessiveItems?);
    private _fixPosToBoundsX(pos, dims);
    private _fixSizeToBoundsX(pos, dims);
    private _isWithinBoundsY(pos, dims, allowExcessiveItems?);
    private _fixPosToBoundsY(pos, dims);
    private _fixSizeToBoundsY(pos, dims);
    private _isWithinBounds(pos, dims, allowExcessiveItems?);
    private _fixPosToBounds(pos, dims);
    private _fixSizeToBounds(pos, dims);
    private _addToGrid(item);
    private _removeFromGrid(item);
    private _updateSize();
    private _getMaxRow();
    private _getMaxCol();
    private _getMousePosition(e);
    private _getAbsoluteMousePosition(e);
    private _getContainerColumns();
    private _getContainerRows();
    private _getScreenMargin();
    private _getItemFromPosition(position);
    private _createPlaceholder(item);
    private _emitOnItemChange();
    private _defineListeners();
    private _enableListeners();
    private _disableListeners();
    private _isTouchDevice();
    private _enableTouchListeners();
    private _enableMouseListeners();
}