import { RouteBuilderService } from "../../../services/abstract-route";
import { RouteInfo } from "../../../entity/route-info";

declare var ymaps;

export class YandexRouteBuilderService extends RouteBuilderService<ymaps.Map, ymaps.GeoObject> {
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

    showRoute(typeRoute: string): void {
        throw new Error("Method not implemented.");
    }
}