import { IPosition } from "../interfaces/i-position";
import { ISearchMinimalRequest } from "../interfaces/i-search-minimal-request";
import { SearchMinimal } from "./search-minimal";

export class SearchMinimalRequest {
    filter: SearchMin;
}

export class SearchMin {
    coordinateContains: IPosition
    distance: number;
    distanceUnit: string;
    nameContains: string;
    languageId: number;
    id: number;
}
