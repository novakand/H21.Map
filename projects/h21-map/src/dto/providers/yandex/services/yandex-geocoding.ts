import { Injectable } from "@angular/core";
import { GeoCodingService } from "../../../services/abstract-geocoding";
import { Observable } from "rxjs";
import { IPosition } from "../../../interfaces/i-position";
import { CallbackName } from "../../../enum/e-callback-name";
import { Point } from "../../../entity/point";
import { IPoint } from "../../../interfaces/i-point";
import { YandexAddressType } from "../enum/e-yandex-address-type";
import { IPointAddress } from "../../../interfaces/i-address";


@Injectable()
export class YandexGeocodingService extends GeoCodingService<ymaps.Map, ymaps.GeoObject> {

    getAddress(latitude: number, longitude: number): Observable<IPoint> {
        try {
            let geocoder = ymaps.geocode([latitude, longitude]);
            let point: Point = new Point();

            return new Observable(observer => {
                geocoder.then(
                    (result) => {
                        const place = result.geoObjects.get(0);
                        if (place) {

                            const address = this.getDetailedAddress(place);

                            if (address) {

                                point.address = <IPointAddress>{
                                    country: address.country,
                                    city: address.city,
                                    street: address.street,
                                    district: address.district,
                                    house: address.house,
                                    postCode: address.postalCode,
                                    countryCode: address.countryCode
                                }
                            }

                            point.position = <IPosition>{
                                latitude: place.geometry._coordinates[0],
                                longitude: place.geometry._coordinates[1],
                            }

                            point.name = place.properties._data.description;

                            this.map.callbackMap.emit(CallbackName.geocoderAddressResult, point);
                            observer.next(point);
                        }
                    },
                    () => {
                        observer.next(null);
                        this.map.callbackMap.emit(CallbackName.geocoderAddressResult, []);
                    }
                );

            })
        } catch (error) {

        }
    }
    getCoordinates(address: string): Observable<IPosition> {

        let geocoder = ymaps.geocode(address);
        return new Observable(observer => {
            geocoder.then(
                (result) => {
                    const place = result.geoObjects.get(0);

                    if (place) {
                        let position = <IPosition>{
                            latitude: place.geometry._coordinates[0],
                            longitude: place.geometry._coordinates[1]
                        }
                        observer.next(position);

                    }
                },
                () => {
                    observer.next(null);
                    this.map.callbackMap.emit(CallbackName.geocoderAddressResult, []);
                }
            );

        })

    }


    private getDetailedAddress(place: any) {
        try {
            const components = place.properties._data.metaDataProperty.GeocoderMetaData.Address.Components;
            if (components === undefined) {
                return null;
            }


            const country = this.getKind(components, YandexAddressType.country);
            const locality = this.getKind(components, YandexAddressType.locality);
            const street = this.getKind(components, YandexAddressType.street);
            const house = this.getKind(components, YandexAddressType.house);
            const district = this.getKind(components, YandexAddressType.district);
            const countryCode = place.properties._data.metaDataProperty.GeocoderMetaData.Address.country_code;
            const postalCode = ''
            const city = locality || this.getKind(components, YandexAddressType.city);

            return { country, postalCode, street, countryCode, house, district, city };
        } catch (error) {

        }

    }
    private getComponent(components: any, name: string) {
        return components.filter(component => component.kind === name);
    }
    private getKind(components: any, name: string) {
        try {
            const component = this.getComponent(components, name);
            return component && component[0].name;
        } catch (error) {

        }
    }
}