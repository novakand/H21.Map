import { SearchService } from "../../../services/abstract-search";
import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { GoogleAddressType } from "../enum/e-google-address-type";
import { CallbackName } from "../../../enum/e-callback-name";
import { LanguageService } from "../../../enum/e-language-service";
import { PointType } from "../../../enum/e-point-type";
import { IPoint } from "../../../interfaces/i-point";
import { IPosition } from "../../../interfaces/i-position";
import { IPointAddress } from "../../../interfaces/i-address";
import { ProviderName } from "../../../enum/e-provider-name";

declare var google: any;

const place = null as google.maps.places.PlaceResult;
type Components = typeof place.address_components;

@Injectable()
export class GoogleSearchService extends SearchService<google.maps.Map, google.maps.Marker> {

	searchAutocomplete(query: string): Observable<IPoint[]> {
		let result = [];
		let service: google.maps.places.AutocompleteService = new google.maps.places.AutocompleteService();
		let request = {
			input: query,
			language: LanguageService.en
		};

		return new Observable((observer: Observer<IPoint[]>) => {
			service.getPlacePredictions(request, (results: google.maps.places.AutocompletePrediction[], status: google.maps.places.PlacesServiceStatus) => {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					for (var i = 0; i < results.length; i++) {

						let place = results[i];
						const point = <IPoint>{
							id: place.place_id,
							name: place.description,
							title: place.description,
							provider: ProviderName.google,
							googlePlaceId: place.place_id,
							subtype: place.types[0]
						}

						result.push(point);
					}

					this.map.callbackMap.emit(CallbackName.searchResult, result);
					observer.next(result);
					observer.complete();
				}
				else {
					observer.next(null);
					this.map.callbackMap.emit(CallbackName.searchResult, null);
				}
			});

		});
	}

	searchPlace(query: string): Observable<IPoint[]> {

		let result = [];
		let service: google.maps.places.PlacesService = new google.maps.places.PlacesService(this.map.api);
		let request = <google.maps.places.PlaceSearchRequest>{
			keyword: query,
			bounds: this.map.api.getBounds(),
			language: LanguageService.en
		};

		return new Observable((observer: Observer<IPoint[]>) => {
			service.nearbySearch(request, (results: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus) => {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					for (var i = 0; i < results.length; i++) {

						const place = results[i];

						const point = <IPoint>{
							id: place.place_id,
							name: place.name,
							type: PointType.internet,
							provider: ProviderName.google,
							googlePlaceId: place.place_id,
							subtype: place.types[0]
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

						result.push(point);
					}

					this.map.callbackMap.emit(CallbackName.searchResult, result);
					observer.next(result);
					observer.complete();
				}
				else {
					observer.next(null);
					this.map.callbackMap.emit(CallbackName.searchResult, null);
				}
			});

		});
	}

	searchDetails(placeId: string): Observable<IPoint> {
		return new Observable((observer: Observer<IPoint>) => {
			let placesService: google.maps.places.PlacesService = new google.maps.places.PlacesService(this.map.api);

			placesService.getDetails({ placeId: placeId },
				(results: google.maps.places.PlaceResult, status: google.maps.places.PlacesServiceStatus) => {
					if (google.maps.places.PlacesServiceStatus.OK) {

						if (results) {
							const place = results;
							const point = <IPoint>{
								id: place.place_id,
								name: place.name,
								provider: ProviderName.google,
								googlePlaceId: place.place_id,
								subtype: place.types[0]
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
							this.map.callbackMap.emit(CallbackName.searchDetailsResult, point);
							observer.next(point);
						}

						this.map.callbackMap.emit(CallbackName.responseMapError, status);
					}
				});
		});
	}
	private getDetailedAddress(place: google.maps.places.PlaceResult) {
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
}
