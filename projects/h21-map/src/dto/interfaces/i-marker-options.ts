import { IIcon } from "./i-icon";
import { IPosition } from "./i-position";

export interface IMarkerOptions {
    draggable: boolean;
    visible: boolean;
    clickable: boolean;
    icon: IIcon;
    optimized: boolean;
    title: string;
    opacity: number;
    position: IPosition;
    label: string,
    cursor: string
}
