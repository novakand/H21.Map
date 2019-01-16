import { Injectable } from "@angular/core";
import { IEventMouse } from "../interfaces/i-event-mouse-map";
import { IPosition } from "../interfaces/i-position";
import { IBounds } from "../interfaces/i-bounds";
import { MapService } from "./abstract-map";

@Injectable()
export abstract class ConversionsService<T,U> {

    map: MapService<T,U>;

    initMap(map: MapService<T,U>): void {

        this.map = map;
    }

    abstract translatePosition(event: IEventMouse): IPosition;

    abstract translateBounds(event?: IEventMouse): IBounds;
}