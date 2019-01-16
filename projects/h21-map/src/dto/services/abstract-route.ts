import { Injectable } from "@angular/core";
import { MapService } from "./abstract-map";
import { RouteInfo } from "../entity/route-info";
import { IPointMin } from "../interfaces/i-point-min";

@Injectable()
export abstract class RouteBuilderService<T,U> {

  map: MapService<T,U>;
  routeInfo: RouteInfo
  startPoint: IPointMin;
  finishPoint: IPointMin;
  
  abstract addStartPoint(): void;
  abstract addFinishPoint(): void;
  abstract getInfoDistance(): RouteInfo;
  abstract build(): void;

  setStartPoint(point: IPointMin) {
    this.startPoint = point;
    return this;
  }

  setFinishPoint(point: IPointMin) {
    this.finishPoint = point;
    return this;
  }

  initMap(map: MapService<T,U>): void {
    this.map = map;
  }

}
