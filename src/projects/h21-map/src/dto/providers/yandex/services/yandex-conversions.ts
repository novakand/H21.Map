import { IPosition } from "../../../interfaces/i-position";
import { IEventMouse } from "../../../interfaces/i-event-mouse-map";
import { Injectable } from "@angular/core";
import { ConversionsService } from "../../../services/abstract-conversions";
import { IBounds } from "../../../interfaces/i-bounds";

@Injectable()
export class YandexConversionsService extends ConversionsService<ymaps.Map, ymaps.GeoObject> {
    translateLatLng(LatLng: number[]): IPosition {

        const position = <IPosition>{
            latitude: LatLng[0],
            longitude: LatLng[1]
        }
        return position;
    }
    translateBounds(event): any {
        const bounds = event.get('newBounds');
        if (bounds) {

            const currentBounds = <IBounds>{
                ne: <IPosition>{
                    latitude: bounds[0][0],
                    longitude: bounds[0][1],
                },
                sw: <IPosition>{
                    latitude: bounds[1][0],
                    longitude: bounds[1][1],
                }
            }
            return currentBounds;

        }

    }

    translatePosition(event: IEventMouse): IPosition {
        event.stopImmediatePropagation();

        if (event) {
            let latLng = event.get('coords');
            let position = <IPosition>{
                latitude: latLng[0],
                longitude: latLng[1]
            }
            return position;
        }
    }

}