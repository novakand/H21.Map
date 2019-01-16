import { Injectable } from "@angular/core";
import { GeolocationService } from "../../../services/abstract-geolocation";
import { Observable } from "rxjs";
import { IPosition } from "../../../interfaces/i-position";


@Injectable()
export class BaiduGeoLocationService extends GeolocationService<BMap.Map, BMap.Marker> {

    getGeoLocation(): Observable<IPosition> {
       return super.getGeoLocation();
    }
}