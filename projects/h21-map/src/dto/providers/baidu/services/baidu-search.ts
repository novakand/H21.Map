import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { SearchService } from "../../../services/abstract-search";
import { CallbackName } from "../../../enum/e-callback-name"
import { IPoint } from "../../../interfaces/i-point";
import { PointType } from "../../../enum/e-point-type";
import { IPosition } from "../../../interfaces/i-position";
import { IPointAddress } from "../../../interfaces/i-address";
import { ProviderName } from "../../../enum/e-provider-name";


@Injectable()
export class BaiduSearchService extends SearchService<BMap.Map, BMap.Marker> {

    searchAutocomplete(query: string): Observable<IPoint[]> {
        throw new Error("Method not implemented.");
    }

    searchDetails(placeId: string): Observable<IPoint> {
        throw new Error("Method not implemented.");
    }

    searchPlace(query: string): Observable<IPoint[]> {

        var result = []
        return new Observable((observer: Observer<IPoint[]>) => {
            let options = {
                onSearchComplete: (results) => {

                    if (local.getStatus() == BMAP_STATUS_SUCCESS) {

                        for (var i = 0; i < results.getCurrentNumPois(); i++) {
                            let place = results.getPoi(i);

                            if (place) {

                                const point = <IPoint>{
                                    name: place.title,
                                    id: place.uid,
                                    type: PointType.internet,
                                    provider: ProviderName.baidu,
                                }
                                point.position = <IPosition>{
                                    latitude: place.point.lat,
                                    longitude: place.point.lng,
                                }

                                point.address = <IPointAddress>{
                                    city: place.city,
                                    district: place.province,
                                    postCode: place.postcode,
                                    description: place.address
                                }


                                result.push(point)
                            }
                        }

                        this.map.callbackMap.emit(CallbackName.searchResult, result);
                        observer.next(result);
                    }
                    else {
                    }
                }
            };

            var local: BMap.LocalSearch = new BMap.LocalSearch(this.map.api, options);
            local.search(query);
        });

    }
}