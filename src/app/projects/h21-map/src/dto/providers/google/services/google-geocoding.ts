import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GeoCodingService } from "../../../services/abstract-geocoding";
import { IPosition } from "../../../interfaces/i-position";
import { CallbackName } from "../../../enum/e-callback-name";
import { PointType } from "../../../enum/e-point-type";
import { GoogleAddressType } from "../enum/e-google-address-type";
import { IPoint } from "../../../interfaces/i-point";
import { Point } from "../../../entity/point";
import { PointAddress, IPointAddress } from "../../../interfaces/i-address";
import { Position } from "../../../entity/position";

const place = null as google.maps.places.PlaceResult;
type Components = typeof place.address_components;


@Injectable()
export class GoogleGeocodingService extends GeoCodingService<google.maps.Map, google.maps.Marker> {

    getCoordinates(address: string): Observable<IPosition> {
        try {
            let geocoder: google.maps.Geocoder = new google.maps.Geocoder();
            return new Observable(observer => {
                geocoder.geocode({ address: address },
                    (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results) {
                                let place = results[0];
                                let position = <IPosition>{
                                    latitude: place.geometry.location.lat(),
                                    longitude: place.geometry.location.lng()
                                }

                                this.map.callbackMap.emit(CallbackName.geocoderCoordinatesResult, position);
                                observer.next(position);

                            } else {
                                observer.next(null);
                                this.map.callbackMap.emit(CallbackName.geocoderCoordinatesResult, null);
                            }
                        } else {
                            observer.error(status);
                            this.map.callbackMap.emit(CallbackName.responseMapError, status);
                        }
                        observer.complete();
                    });
            })
        }
        catch (error) { }
    }

    getAddress(latitude: number, longitude: number): Observable<IPoint> {
        try {
            const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
            let point: Point = new Point();
            let latLng: google.maps.LatLng = this.generateCoordinates(latitude, longitude)

            return new Observable(observer => {
                geocoder.geocode({ location: latLng },
                    (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results) {
                                let place = results[0];

                                const point = <IPoint>{
                                    id: place.place_id,
                                    name: place.formatted_address,
                                    type: PointType.internet,
                                    provider: 'google',
                                    googlePlaceId: place.place_id
                                }


                                const address = this.getDetailedAddress(place);

                                if (address) {
                                    point.address = <IPointAddress>{
                                        city: address.city,
                                        country: address.country,
                                        district: address.district,
                                        countryCode: address.countryCode,
                                        description: place.formatted_address
                                    }
                                }
                                point.position = <IPosition>{
                                    latitude: place.geometry.location.lat(),
                                    longitude: place.geometry.location.lng(),
                                }

                                this.map.callbackMap.emit(CallbackName.geocoderAddressResult, point);

                                observer.next(point);
                            } else {
                                observer.next(null);
                                this.map.callbackMap.emit(CallbackName.geocoderAddressResult, []);
                            }
                        } else {
                            observer.error(status);
                            this.map.callbackMap.emit(CallbackName.geocoderAddressResult, null);
                        }
                        observer.complete();
                    });
            })
        }
        catch (error) { }
    }


    private getDetailedAddress(place: google.maps.places.PlaceResult | google.maps.GeocoderResult) {
        const components = place.address_components;
        if (components === undefined) {
            return null;
        }
        const areaLevel1 = this.getShort(components, GoogleAddressType.administrativeAreaLevel1);
        const areaLevel2 = this.getShort(components, GoogleAddressType.administrativeAreaLevel2);
        const areaLevel3 = this.getShort(components, GoogleAddressType.administrativeAreaLevel3);
        const locality = this.getLong(components, GoogleAddressType.locality);
        const country = this.getLong(components, GoogleAddressType.country);
        const countryCode = this.getShort(components, GoogleAddressType.country);
        const city = locality || areaLevel3;
        const district = areaLevel1 || areaLevel2;
        const street = this.getLong(components, GoogleAddressType.route);
        const house = this.getLong(components, GoogleAddressType.streetNumber);
        const postalCode = this.getLong(components, GoogleAddressType.postalCode);

        return { country, city, district, street, house, postalCode, countryCode };
    }
    private getComponent(components: Components, name: string) {
        return components.filter(component => component.types[0] === name)[0];
    }
    private getLong(components: Components, name: string) {
        const component = this.getComponent(components, name);
        return component && component.long_name;
    }
    private getShort(components: Components, name: string) {
        const component = this.getComponent(components, name);
        return component && component.short_name;
    }

    private generateCoordinates(latitude: number, longitude: number) {
        return new google.maps.LatLng(latitude, longitude);
    }

}