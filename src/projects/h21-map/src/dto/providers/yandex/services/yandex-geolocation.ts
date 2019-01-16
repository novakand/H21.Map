import { Injectable } from "@angular/core";
import { IPosition } from "../../../interfaces/i-position";
import { CallbackName } from "../../../enum/e-callback-name";
import { GeolocationService } from "../../../services/abstract-geolocation";
import { Observable } from "rxjs";


@Injectable()
export class YandexGeoLocationService extends GeolocationService<ymaps.Map,ymaps.GeoObject> {

    getGeoLocation(): Observable<IPosition> {
        return super.getGeoLocation();
     }
}