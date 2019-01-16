import { Injectable } from "@angular/core";
import { PolygonService } from "../../../services/abstract-polygon";


@Injectable()
export class BaiduPolygonService extends PolygonService<BMap.Map, BMap.Marker> {}