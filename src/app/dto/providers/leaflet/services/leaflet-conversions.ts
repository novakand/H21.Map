import { Injectable } from "@angular/core";
import { ConversionsService } from "../../../services/abstract-conversions";
import { IPosition } from "../../../interfaces/i-position";
import { IEventMouse } from "../../../interfaces/i-event-mouse-map";
import { IBounds } from "../../../interfaces/i-bounds";
import { Position } from "../../../entity/position";
import { BoundsMap } from "../../../entity/bounds-map";


@Injectable()
export class LeafletConversionsService extends ConversionsService<L.Map, L.Marker> {

    translateBounds(): IBounds {
        const bounds = this.map.api.getBounds();
        if (bounds) {
            const SW = bounds.getSouthWest();
            const NE = bounds.getNorthEast();
            const currentBounds = <IBounds>{
                ne: <IPosition>{
                    latitude: NE.lat,
                    longitude: NE.lng,
                },
                sw: <IPosition>{
                    latitude: SW.lat,
                    longitude: NE.lng,
                }
            }

            return currentBounds;
        }
    }
    translatePosition(event: IEventMouse): IPosition {

        var position = <IPosition>{
            latitude: event.latlng.lat,
            longitude: event.latlng.lng
        }

        return position;
    }
}