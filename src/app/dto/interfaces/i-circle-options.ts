import { IPosition } from "./i-position";

export interface ICircleOptions {
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
    fillColor: string;
    fillOpacity: number;
    center: IPosition;
    radius: number;
    draggable: boolean;
    editable: boolean;
    visible: boolean;
    zIndex: number;
}