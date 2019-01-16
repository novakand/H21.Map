import { IPoint } from "../interfaces/i-point";
import { IIcon } from "../interfaces/i-icon";
import { IPosition } from "../interfaces/i-position";
import { IPointAddress } from "../interfaces/i-address";
import { IAdditionalInformation } from "../interfaces/i-additional-information";

export class Point implements IPoint {
    title: string;
    name: string;
    photos: Array<IIcon>;
    address: IPointAddress;
    additionalInformation: IAdditionalInformation;
    position: IPosition;
    cancellationPolicy: string;
    extras: string;
    tmcAgencyMargin: string;
    id: string;
    googlePlaceId: string;
    type: string;
    subtype: string;
    source: string;
    provider: string;
}
