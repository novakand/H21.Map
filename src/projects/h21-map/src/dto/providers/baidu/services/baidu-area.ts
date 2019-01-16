import { Injectable } from "@angular/core";
import { AreaService } from "../../../services/abstract-area";


@Injectable()
export class BaiduAreaService extends AreaService<BMap.Map, BMap.Marker> {
}