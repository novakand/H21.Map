import { Injectable } from "@angular/core";
import { AreaService } from "../../../services/abstract-area";


@Injectable()
export class GoogleAreaService extends AreaService<google.maps.Map, google.maps.Marker> {
 
}