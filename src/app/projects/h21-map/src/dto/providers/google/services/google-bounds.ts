import { Injectable } from "@angular/core";
import { BoundsService } from "../../../services/abstract-bounds";

@Injectable()
export class GoogleBoundsService extends BoundsService <google.maps.Map,google.maps.Marker> { }