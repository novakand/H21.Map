import { IImageRating } from "./i-image-rating";

export interface IRating {
    value: number;
    image: IImageRating
    type: string;
    hotelId: number;
    id: number;
}
