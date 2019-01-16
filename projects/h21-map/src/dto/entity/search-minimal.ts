
import { IPosition } from "../interfaces/i-position";
import { IPointMin } from "../interfaces/i-point-min";
import { ISearchMinimal } from "../interfaces/i-search-minimal";

export class SearchMinimal implements ISearchMinimal {
    coordinateContains: IPosition
    distance: number;
    distanceUnit: string;
    nameContains: string;
    languageId: number;
    id: number;
    items: Array<IPointMin>;
}