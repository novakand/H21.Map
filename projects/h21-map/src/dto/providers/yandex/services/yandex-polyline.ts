
import { Injectable } from "@angular/core";
import { PolylineService } from "../../../services/abstract-polyline";

@Injectable()
export class YandexPolylineService extends PolylineService<ymaps.Map, ymaps.GeoObject> {
  
}