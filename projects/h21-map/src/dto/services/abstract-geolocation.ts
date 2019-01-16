import { Injectable } from "@angular/core";
import { MapService } from "./abstract-map";
import { CallbackName } from "../enum/e-callback-name";
import { IPosition } from "../interfaces/i-position";
import { Observable, Observer } from "rxjs";

@Injectable()
export abstract class GeolocationService<T, U>{

    map: MapService<T, U>;

    initMap(map: MapService<T, U>): void {
        this.map = map;
    }

    getGeoLocation(): Observable<IPosition> {

        return new Observable((observer: Observer<IPosition>) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    let position = <IPosition>{
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    }
                    observer.next(position);
                    this.map.callbackMap.emit(CallbackName.geoPosition, position);
                });
            } else {
                this.map.callbackMap.emit(CallbackName.geoPosition, null);
            }
        });
    }
}