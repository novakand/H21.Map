import { MapService } from "../services/abstract-map";

export interface IInitMap<T,U> {
    map: MapService<T,U>;
    
    initMap(map: MapService<T,U>): void;
}