import { Injectable } from "@angular/core";
import { AreaService } from "../../../services/abstract-area";



@Injectable()
export class YandexAreaService extends AreaService<ymaps.Map,ymaps.GeoObject>  {
  
}