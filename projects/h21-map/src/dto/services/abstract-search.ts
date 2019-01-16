import { MapService } from "./abstract-map";
import { IPoint } from "../interfaces/i-point";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export abstract class SearchService <T,U> {

    map: MapService<T,U>;

    initMap(map: MapService<T,U>): void {
        this.map = map;
    }
    abstract searchPlace(query: string): Observable<IPoint[]>;
    abstract searchDetails(placeId: string): Observable<IPoint>;
    abstract searchAutocomplete(query: string): Observable<IPoint[]>;
}
