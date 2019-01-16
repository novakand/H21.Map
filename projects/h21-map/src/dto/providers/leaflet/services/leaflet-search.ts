import { SearchService } from "../../../services/abstract-search";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CallbackName } from "../../../enum/e-callback-name";
import { IPoint } from "../../../interfaces/i-point";
import { PointType } from "../../../enum/e-point-type";
import { IPosition } from "../../../interfaces/i-position";
import { IPointAddress } from "../../../interfaces/i-address";
import { ProviderName } from "../../../enum/e-provider-name";


@Injectable()
export class LeafletSearchService extends SearchService<L.Map, L.Marker> {
    constructor(private http: HttpClient) {
        super();
    }

    searchAutocomplete(query: string): Observable<IPoint[]> {
        throw new Error("Method not implemented.");
    }

    searchDetails(placeId: string): Observable<IPoint> {
        throw new Error("Method not implemented.");
    }

    searchPlace(query: string): Observable<IPoint[]> {
        let result = [];

        return new Observable(observer => {
            this.http.get<any>("http://nominatim.openstreetmap.org/search?format=jsonv2&accept-language=en&namedetails=1&addressdetails=1&limit=5&q=" + query).subscribe(results => {
                if (results) {
                    for (var i = 0; i < results.length; i++) {
                        let place = results[i];
                    
                        const point = <IPoint>{
                            id: place.place_id,
                            type: PointType.internet,
                            subtype: place.type,
                            provider: ProviderName.leaflet,
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

                        if (place.namedetails.name) {
                            point.name = place.namedetails.name;
                        }
                        result.push(point)
                    }

                    this.map.callbackMap.emit(CallbackName.geocoderAddressResult, result);
                    observer.next(result);

                } else {
                    observer.next(null);
                    this.map.callbackMap.emit(CallbackName.geocoderAddressResult, []);
                }

            }, () => {
                observer.error(null);
                this.map.callbackMap.emit(CallbackName.geocoderAddressResult, null);
            });
        })
    }

    private getDetailedAddress(place: any) {
        try {
            const components = place.address;
            if (components === undefined) {
                return null;
            }
            const city = components.city || components.state
            const district = components.state_district || components.suburb;
            const street = components.road;
            const house = components.house_number;
            const country = components.country;
            const postalCode = components.postcode;
            const countryCode = components.country_code.slice(0, 3).toUpperCase();

            return { country, city, district, street, house, countryCode, postalCode };
        }
        catch (error) { }
    }
}