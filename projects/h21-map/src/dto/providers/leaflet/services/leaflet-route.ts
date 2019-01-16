import { RouteBuilderService } from "../../../services/abstract-route";
import { RouteInfo } from "../../../entity/route-info";
import { TypeRoute } from "../../../enum/e-type-route";
import { Observable, Observer } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RouteTextValue } from "../../../entity/route-text-value";
import { Injectable } from "@angular/core";

declare var L;

@Injectable()
export class LeafletRouteBuilderService extends RouteBuilderService<L.Map, L.Marker> {
    addStartPoint(): void {
        throw new Error("Method not implemented.");
    }    addFinishPoint(): void {
        throw new Error("Method not implemented.");
    }
    getInfoDistance(): RouteInfo {
        throw new Error("Method not implemented.");
    }
    build(): void {
        throw new Error("Method not implemented.");
    }    

}

