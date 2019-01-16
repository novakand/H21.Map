import { IPosition } from "../../../interfaces/i-position";
import { IEventMouse } from "../../../interfaces/i-event-mouse-map";
import { Injectable } from "@angular/core";
import { ConversionsService } from "../../../services/abstract-conversions";
import { IBounds } from "../../../interfaces/i-bounds";

@Injectable()
export class GoogleConversionsService extends ConversionsService<google.maps.Map, google.maps.Marker> {

    translatePosition(event: IEventMouse): IPosition {
        event.stop();
        var position = <IPosition>{
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng()
        }
        return position;
    }

    translateBounds(): IBounds {
        const bounds = this.map.api.getBounds();

        if (bounds) {
            const SW = bounds.getSouthWest();
            const NE = bounds.getNorthEast();
            const currentBounds = <IBounds>{
                ne: <IPosition>{
                    latitude: NE.lat(),
                    longitude: NE.lng(),
                },
                sw: <IPosition>{
                    latitude: SW.lat(),
                    longitude: NE.lng(),
                }
            }
            return currentBounds;
        }
    }
}