import { IPosition } from "../../../interfaces/i-position";
import { IEventMouse } from "../../../interfaces/i-event-mouse-map";
import { Injectable } from "@angular/core";
import { ConversionsService } from "../../../services/abstract-conversions";
import { IBounds } from "../../../interfaces/i-bounds";

@Injectable()
export class BaiduConversionsService extends ConversionsService<BMap.Map, BMap.Marker> {

    public translatePosition(event: IEventMouse): IPosition {

        var position = <IPosition>{
            latitude: event.point.lat,
            longitude: event.point.lng
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

}