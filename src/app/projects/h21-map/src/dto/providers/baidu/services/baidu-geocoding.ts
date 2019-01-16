import { Injectable } from "@angular/core";
import { GeoCodingService } from "../../../services/abstract-geocoding";
import { Observable } from "rxjs";
import { IPosition } from "../../../interfaces/i-position";
import { PointType } from "../../../enum/e-point-type";
import { CallbackName } from "../../../enum/e-callback-name";
import { IPoint } from "../../../interfaces/i-point";
import { ProviderName } from "../../../enum/e-provider-name";
import { IPointAddress } from "../../../interfaces/i-address";

@Injectable()
export class BaiduGeocodingService extends GeoCodingService<BMap.Map, BMap.Marker> {

    getCoordinates(address: string): Observable<IPosition> {
        const geocoder = new BMap.Geocoder();

        return new Observable(observer => {
            geocoder.getPoint(address, (point: BMap.Point) => {

                if (point) {
                    const position = <IPosition>{
                        latitude: point.lat,
                        longitude: point.lng
                    }
                    observer.next(position);
                }
                else {
                    observer.next(null);
                }
            },
                '');
        })
    }
    getAddress(latitude: number, longitude: number): Observable<IPoint> {

        const latLng = new BMap.Point(longitude, latitude);
        const geocoder = new BMap.Geocoder();

        return new Observable(observer => {

            geocoder.getLocation(latLng, (place: BMap.GeocoderResult) => {
                if (place) {

                    const point = <IPoint>{
                        name: place.address,
                        id: '',
                        type: PointType.internet,
                        provider: ProviderName.baidu,
                    }
                    point.position = <IPosition>{
                        latitude: place.point.lat,
                        longitude: place.point.lng,
                    }

                    const address = this.getDetailedAddress(place);

                    if (address) {
                        point.address = <IPointAddress>{
                            city: address.city,
                            country: address.country,
                            district: address.district,
                            house: address.house,
                            countryCode: address.countryCode,
                            description: place.address,
                        }
                    }

                    this.map.callbackMap.emit(CallbackName.geocoderAddressResult, point);
                    observer.next(point);
                }

                observer.complete();
            });
        })

    }

    private getDetailedAddress(place: BMap.GeocoderResult) {
        try {
            const components = place.addressComponents;
            if (components === undefined) {
                return null;
            }
            const city = components.city;
            const district = components.district || components.province;
            const street = components.street;
            const house = components.streetNumber;
            const country = place.address.split(',').pop();
            const countryCode = country.slice(0, 3).toUpperCase();

            return { country, city, district, street, house, countryCode };
        }
        catch (error) { }
    }
}