import { Injectable } from "@angular/core";
import { PolylineService } from "../../../services/abstract-polyline";

@Injectable()
export class GooglePolylineService extends PolylineService<google.maps.Map, google.maps.Marker> {
   
}