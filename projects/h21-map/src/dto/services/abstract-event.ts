import { MapService } from '../services/abstract-map';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IInitMap } from '../interfaces/i-init-map';
import { IBounds } from '../interfaces/i-bounds';

@Injectable()
export abstract class EventService<T, U> implements IInitMap<T,U> {

  map: MapService<T, U>;

  initMap(map: MapService<T, U>): void {

    this.map = map;
  }

  abstract createEvent<E>(eventName: string): Observable<E>;

  abstract createEventBoundsChange(): Observable<IBounds>;

  abstract createEventZoomChange(): Observable<number>;

}
