import { EventService } from "../../../services/abstract-event";
import { Observable, Observer } from "rxjs";
import { Injectable, NgZone } from "@angular/core";
import { IBounds } from "../../../interfaces/i-bounds";
import { LeafletMapEvents } from "../enum/e-leaflet-events";

@Injectable()
export class LeafletEventService extends EventService<L.Map,L.Marker> {

    constructor(private _zone: NgZone) {
        super();

    }

    createEvent<E>(eventName: string): Observable<E> {
        const leafletEventName: string = LeafletMapEvents[eventName];
        return Observable.create((observer: Observer<any>) => {
            this.map.api.addEventListener(leafletEventName || '', (event) => {
                this._zone.run(() => observer.next(event));
            });
        });

    }

    createEventBoundsChange(): Observable<IBounds> {
        return new Observable((observer: Observer<IBounds>) => {
            this.createEvent<any>('moveend').subscribe(() => {
                this._zone.run(() => observer.next(this.map.conversions.translateBounds()));

            });
            this.createEvent<any>('dragend').subscribe(() => {
                this._zone.run(() => observer.next(this.map.conversions.translateBounds()));

            });
        });
    }

    createEventZoomChange(): Observable<number> {
        return new Observable((observer: Observer<number>) => {
            this.createEvent<any>('zoomend').subscribe(() => {
                this._zone.run(() => observer.next(this.map.api.getZoom()));
            });
        });

    }
}