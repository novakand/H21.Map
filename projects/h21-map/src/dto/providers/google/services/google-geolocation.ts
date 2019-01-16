import { Injectable } from "@angular/core";
import { GeolocationService } from "../../../services/abstract-geolocation";
import { Observable, Observer } from "rxjs";
import { IPosition } from "../../../interfaces/i-position";

@Injectable()
export class GoogleGeoLocationService extends GeolocationService<google.maps.Map, google.maps.Marker> {

    getGeoLocation(): Observable<IPosition> {
        return super.getGeoLocation();
    }
}