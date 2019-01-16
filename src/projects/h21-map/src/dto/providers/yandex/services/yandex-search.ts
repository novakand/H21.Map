import { Injectable } from "@angular/core";
import { SearchService } from "../../../services/abstract-search";
import { Observable, Observer } from "rxjs";
import { IPoint } from "../../../interfaces/i-point";
import { IPosition } from "../../../interfaces/i-position";
import { IPointAddress } from "../../../interfaces/i-address";
import { YandexAddressType } from "../enum/e-yandex-address-type";
import { PointType } from "../../../enum/e-point-type";
import { CallbackName } from "../../../enum/e-callback-name";
import { ProviderName } from "../../../enum/e-provider-name";


@Injectable()
export class YandexSearchService extends SearchService<ymaps.Map, ymaps.GeoObject> {

    searchAutocomplete(query: string): Observable<IPoint[]> {
        throw new Error("Method not implemented.");
    }

    searchDetails(placeId: string): Observable<IPoint> {
        throw new Error("Method not implemented.");
    }

    searchPlace(query: string): Observable<IPoint[]> {

        let result = [];

        const options = <ymaps.control.ISearchControlParameters>{
            provider: 'yandex#search'
        }

        const searchControl: ymaps.control.SearchControl = new ymaps.control.SearchControl(options);

        searchControl.search(query);

        return new Observable((observer: Observer<IPoint[]>) => {
            searchControl.events.add('load', () => {

                const results = searchControl.getResultsArray();
        
                for (var i = 0; i < results.length; i++) {
                    const place = results[i];

                    const point = <IPoint>{
                        id: place.properties._data.metaDataProperty.GeocoderMetaData.id,
                        title: place.properties._data.text,
                        name: place.properties._data.name,
                        type: PointType.internet,
                        provider: ProviderName.yandex
                    }

                    const address = this.getDetailedAddress(place);

                    if (address) {
                        point.address = <IPointAddress>{
                            country: address.country,
                            city: address.city,
                            street: address.street,
                            district: address.district,
                            house: address.house,
                            postCode: address.postalCode,
                            countryCode: address.countryCode,
                            description: place.properties._data.description
                        }
                    }

                    point.position = <IPosition>{
                        latitude: place.geometry._coordinates[0],
                        longitude: place.geometry._coordinates[1],
                    }

                    result.push(point);
                }

                this.map.callbackMap.emit(CallbackName.searchResult, result);
                observer.next(result);
            });
            searchControl.events.add('error', () => {

                observer.next(null);
            });
        });

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