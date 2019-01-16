import { Injectable } from "@angular/core";
import { BoundsService } from "../../../services/abstract-bounds";

@Injectable()
export class BaiduBoundsService extends BoundsService  <BMap.Map,BMap.Marker> { }