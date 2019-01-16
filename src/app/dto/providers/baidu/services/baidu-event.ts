import { EventService } from "../../../services/abstract-event";
import { Observable, Observer } from "rxjs";
import { Injectable, NgZone } from "@angular/core";
import { IBounds } from "../../../interfaces/i-bounds";
import { BaiduMapEvents } from "../enum/e-baidu-events";

@Injectable()
export class BaiduEventService extends EventService<BMap.Map, BMap.Marker> {

  constructor(private _zone: NgZone) {
    super();

  }

  createEvent<E>(eventName: string): Observable<E> {
    const baiduEventName: string = BaiduMapEvents[eventName];
    return Observable.create((observer: Observer<E>) => {
      this.map.api.addEventListener(baiduEventName, (event: E) => {
        this._zone.run(() => observer.next(event));
      });
    });

  }

  createEventBoundsChange(): Observable<IBounds> {
    return new Observable((observer: Observer<IBounds>) => {
      this.createEvent('zoomend').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateBounds()));

      });

      this.createEvent('dragend').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateBounds()));

      });

    });
  }
  createEventZoomChange(): Observable<number> {
    return new Observable((observer: Observer<number>) => {
      this.createEvent('zoomend').subscribe(() => {
        this._zone.run(() => observer.next(this.map.api.getZoom()));
      });
    });
  }
}
