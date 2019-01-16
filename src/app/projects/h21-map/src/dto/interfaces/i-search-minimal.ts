import { IPosition } from "./i-position";

export interface ISearchMinimal {
    coordinateContains: IPosition
    distance: number;
    distanceUnit: string;
    nameContains: string;
    languageId: number;
    id: number;
}



