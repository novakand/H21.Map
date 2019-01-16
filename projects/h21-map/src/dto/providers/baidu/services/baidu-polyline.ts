
import { Injectable } from "@angular/core";
import { PolylineService } from "../../../services/abstract-polyline";


@Injectable()
export class BaiduPolylineService extends PolylineService<BMap.Map, BMap.Marker> {}