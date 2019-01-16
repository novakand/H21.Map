import { RouteBuilderService } from "../../../services/abstract-route";
import { RouteInfo } from "../../../entity/route-info";


export class BaiduRouteBuilder extends RouteBuilderService<BMap.Map, BMap.Marker> {
    addStartPoint(): void {
        throw new Error("Method not implemented.");
    }
    addFinishPoint(): void {
        throw new Error("Method not implemented.");
    }
    build(): void {
        throw new Error("Method not implemented.");
    }

    getInfoDistance(): RouteInfo {
        throw new Error("Method not implemented.");
    }
}