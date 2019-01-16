import { Injectable } from "@angular/core";
import { PolygonService } from "../../../services/abstract-polygon";
declare var L;

@Injectable()
export class LeafletPolygonService extends PolygonService<L.Map,L.Marker> {
 
}