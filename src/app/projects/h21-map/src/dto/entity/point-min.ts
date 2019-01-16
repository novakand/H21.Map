import { IPointMin } from "../interfaces/i-point-min";
import { IRating } from "../interfaces/i-rating";
import { ISmallImage, PointType } from "..";

export class PointMin implements IPointMin {
    name: string;
    address: string;
    country: string;
    city: string;
    countryIso: string;
    zipCode: string;
    region: string;
    id: number | string;
    languageId: number;
    location: string;
    latitude: number;
    longitude: number;
    ratings: Array<IRating>;
    smallImage: ISmallImage;
    type: PointType
}