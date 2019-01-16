import { IRouteTextValue } from "../interfaces/i-route-text-value";
import { IRouteInfo } from "../interfaces/i-route-info";

export class RouteInfo implements IRouteInfo {
    distance: IRouteTextValue;
    time: IRouteTextValue;
    timeTraffic: IRouteTextValue;
    type: string;
    staticMapUrl: string;
}
