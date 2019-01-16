import { ICircleOptions } from "../interfaces/i-circle-options";
import { IPosition } from "../interfaces/i-position";

export class CircleOptions implements ICircleOptions {
    visible: boolean;
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
    fillColor: string;
    fillOpacity: number;
    center: IPosition;
    radius: number;
    draggable: boolean;
    editable: boolean;
    zIndex: number;
}