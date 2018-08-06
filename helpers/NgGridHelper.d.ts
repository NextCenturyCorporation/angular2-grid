import { NgGridItem } from "../directives/NgGridItem";
export declare class NgGridHelper {
    static generateUuid(): string;
    static sortItemsByPositionHorizontal(a: NgGridItem, b: NgGridItem): number;
    static sortItemsByPositionVertical(a: NgGridItem, b: NgGridItem): number;
}
