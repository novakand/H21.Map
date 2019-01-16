import { MapType } from "../enum/e-map-type";

export interface IMapManager {
    register(type: MapType, container: HTMLElement): void;
    load(container: HTMLElement): void;
    destroy(): void;
    getActiveMap(): any;
}
