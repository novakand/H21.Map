import { Injectable } from "@angular/core";
import { BoundsService } from "../../../services/abstract-bounds";

@Injectable()
export class YandexBoundsService extends BoundsService<ymaps.Map,ymaps.GeoObject> { }