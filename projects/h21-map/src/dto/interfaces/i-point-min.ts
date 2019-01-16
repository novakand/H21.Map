import { ISmallImage } from "./i-small-image";
import { PointType } from "../enum/e-point-type";

export interface IPointMin {
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
    ratings: any;
    smallImage: ISmallImage;
    type: PointType
}
