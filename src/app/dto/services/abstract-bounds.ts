import { MapService } from "./abstract-map";

export abstract class BoundsService<T,U> {

    map: MapService<T,U>;

    initMap(map: MapService<T,U>): void {
        this.map = map;
    }

}