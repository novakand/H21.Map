
import { Injectable } from "@angular/core";
import { PolylineService } from "../../../services/abstract-polyline";

declare var L;

@Injectable()
export class LeafletPolylineService extends PolylineService<L.Map,L.Marker> {
   
}