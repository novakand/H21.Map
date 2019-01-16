import { Injectable, NgZone } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { EventService } from "../../../services/abstract-event";
import { GoogleMapEvents } from "../enum/google-events";
import { IBounds } from "../../../interfaces/i-bounds";

@Injectable()
export class GoogleEventService extends EventService<google.maps.Map,google.maps.Marker> {

  constructor(private _zone: NgZone) {
    super();

  }

   createEvent<E>(eventName: string): Observable<E> {
    const googleEventName: string = GoogleMapEvents[eventName];
    return Observable.create((observer: Observer<E>) => {
      this.map.api.addListener(googleEventName, (event: any) => {
        this._zone.run(() => observer.next(event));
      });
    });

  }


   createEventBoundsChange(): Observable<IBounds> {
    return new Observable((observer: Observer<IBounds>) => {
      this.createEvent<any>('idle').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateBounds()));

      });

    });
  }

  createEventZoomChange(): Observable<number> {
    return new Observable((observer: Observer<number>) => {
        this.createEvent<any>('zoom_changed').subscribe(() => {
            this._zone.run(() => observer.next(this.map.api.getZoom()));
        });
    });

}

}
