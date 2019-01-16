import { Injectable } from "@angular/core";
import { PolygonService } from "../../../services/abstract-polygon";

@Injectable()
export class YandexPolygonService extends PolygonService<ymaps.Map, ymaps.GeoObject> {

}