import { Injectable } from "@angular/core";
import { AreaService } from "../../../services/abstract-area";


@Injectable()
export class LeafletAreaService extends AreaService <L.Map,L.Marker> {

}