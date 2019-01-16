import { Injectable } from "@angular/core";
import { RouteBuilderService } from "../../../services/abstract-route";
import { RouteInfo } from "../../../entity/route-info";


@Injectable()
export class GoogleRouteBuilderService extends RouteBuilderService<google.maps.Map, google.maps.Marker> {
    addStartPoint(): void {
        throw new Error("Method not implemented.");
    }    
    addFinishPoint(): void {
        throw new Error("Method not implemented.");
    }
    getInfoDistance(): RouteInfo {
        throw new Error("Method not implemented.");
    }
    build(): void {
        throw new Error("Method not implemented.");
    }
}
