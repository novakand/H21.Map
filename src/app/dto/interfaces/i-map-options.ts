import { IPosition } from "./i-position";

export interface IMapOptions {
    center: IPosition;
    zoom: number;
    minZoom: number;
    maxZoom: number;
    enableMapClick: boolean;
    enableAutoResize: boolean;
    enableDoubleClickZoom: boolean;
    scaleControl: boolean;
    enableDraggable: boolean;
    enableDefaultControl: boolean;
    defaultCursor: string;
    enableScrollwheel: boolean;
}


