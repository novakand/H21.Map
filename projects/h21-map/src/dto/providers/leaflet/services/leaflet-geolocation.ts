import { Injectable } from "@angular/core";
import { IPosition } from "../../../interfaces/i-position";
import { CallbackName } from "../../../enum/e-callback-name";
import { GeolocationService } from "../../../services/abstract-geolocation";
import { Observable } from "rxjs";


@Injectable()
export class LeafletGeoLocationService extends GeolocationService<L.Map, L.Marker> {
    getGeoLocation(): Observable<IPosition> {
        return super.getGeoLocation();
    }
}