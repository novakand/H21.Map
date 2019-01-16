import { Injectable, NgZone } from "@angular/core";
import { EventService } from "../../../services/abstract-event";
import { Observable, Observer } from "rxjs";
import { IBounds } from "../../../interfaces/i-bounds";
import { YandexMapEvents } from "../enum/e-yandex-events";

@Injectable()
export class YandexEventService extends EventService<ymaps.Map,ymaps.GeoObject> {

  constructor(private _zone: NgZone) {
    super();
  }
  
  createEvent<E>(eventName: string): Observable<E> {
    const yandexEventName: string = YandexMapEvents[eventName];
    return Observable.create((observer: Observer<E>) => {
      this.map.api.events.add(yandexEventName, (event: any) => {
        this._zone.run(() => observer.next(event));
      });
    });
  }

  createEventBoundsChange(): Observable<IBounds> {
    return new Observable((observer: Observer<IBounds>) => {
      this.createEvent<any>('boundschange').subscribe((event) => {
        this._zone.run(() => observer.next(this.map.conversions.translateBounds(event)));
      });

    });
  }

  createEventZoomChange(): Observable<number> {
    return new Observable((observer: Observer<number>) => {
      this.createEvent<any>('boundschange').subscribe((event) => {
        if (event.get('newZoom') != event.get('oldZoom')) {
          this._zone.run(() => observer.next(event.get('newZoom')));
        }
      });
    });
  }

}