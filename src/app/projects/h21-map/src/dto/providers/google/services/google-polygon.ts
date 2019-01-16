import { Injectable } from "@angular/core";
import { PolygonService } from "../../../services/abstract-polygon";

@Injectable()
export class GooglePolygonService extends PolygonService<google.maps.Map, google.maps.Marker> {
 
}