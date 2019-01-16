import { IApiConfig } from "./i-api-settings";
import { MapService } from "../services/abstract-map";

export interface IMap<T,U> {

    source: IApiConfig;
    instance: MapService<T,U>;
 

}