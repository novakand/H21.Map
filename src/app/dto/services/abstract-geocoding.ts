import { MapService } from "./abstract-map";
import { Observable } from "rxjs";
import { IPosition } from "../interfaces/i-position";
import { IPoint } from "../interfaces/i-point";


export abstract class GeoCodingService<T,U> {

    map: MapService<T,U>;

    initMap(map: MapService<T,U>): void {
        this.map = map;
    }

    abstract getAddress(latitude: number, longitude: number): Observable<IPoint>
    abstract getCoordinates(address: string): Observable<IPosition>
}