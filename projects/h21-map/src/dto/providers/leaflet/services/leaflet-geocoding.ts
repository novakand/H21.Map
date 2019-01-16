import { GeoCodingService } from "../../../services/abstract-geocoding";
import { Observable } from "rxjs";
import { IPosition } from "../../../interfaces/i-position";
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { CallbackName } from "../../../enum/e-callback-name";
import { IPoint } from "../../../interfaces/i-point";
import { PointType } from "../../../enum/e-point-type";
import { IPointAddress } from "../../../interfaces/i-address";


@Injectable()
export class LeafletGeocodingService extends GeoCodingService<L.Map, L.Marker> {

    constructor(private http: HttpClient) {
        super();
    }

    getAddress(latitude: number, longitude: number): Observable<IPoint> {

        return new Observable(observer => {
            this.http.get<any>("https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=en&lat=" + latitude + "&lon=" + longitude + "&addressdetails=1").subscribe(place => {

                if (place) {
                    const point = <IPoint>{
                        id: place.place_id,
                        type: PointType.internet,
                        name: place.name
                    }

                    const address = this.getDetailedAddress(place);

                    if (address) {
                        point.address = <IPointAddress>{
                            city: address.city,
                            country: address.country,
                            district: address.district,
                            countryCode: address.countryCode,
                            postCode: address.postalCode,
                            description: place.display_name
                        }

                    }
                    point.position = <IPosition>{
                        latitude: Number(place.lat),
                        longitude: Number(place.lon)
                    }


                    this.map.callbackMap.emit(CallbackName.geocoderAddressResult, point);
                    observer.next(point);
                }
                else {
                    this.map.callbackMap.emit(CallbackName.geocoderAddressResult, []);
                    observer.next(null);
                }

            }, () => {
                observer.next(null);
                this.map.callbackMap.emit(CallbackName.geocoderAddressResult, null);
            });
        })
    }
    getCoordinates(address: string): Observable<IPosition> {
        return new Observable(observer => {
            this.http.get("http://nominatim.openstreetmap.org/search?format=jsonv2&accept-language=en&namedetails=1&addressdetails=1&limit=1&q=" + address).subscribe(results => {

                if (results) {
                    const place = results[0];
                    const position = <IPosition>{
                        latitude: Number(place.lat),
                        longitude: Number(place.lon),
                    }
                    observer.next(position);
                    observer.complete();

                } else {
                    observer.next(null);
                    this.map.callbackMap.emit(CallbackName.geocoderCoordinatesResult, null);
                }

            }, () => {
                observer.next(null);
                this.map.callbackMap.emit(CallbackName.geocoderCoordinatesResult, null);
            });
        })
    }

    private getDetailedAddress(place: any) {
        try {
            const components = place.address;
            if (components === undefined) {
                return null;
            }
            const city = components.state;
            const district = components.state_district || components.suburb;
            const street = components.street;
            const house = components.streetNumber;
            const country = components.country;
            const postalCode = components.postcode;
            const countryCode = components.country_code.slice(0, 3).toUpperCase();

            return { country, city, district, street, house, countryCode, postalCode };
        }
        catch (error) { }
    }
}