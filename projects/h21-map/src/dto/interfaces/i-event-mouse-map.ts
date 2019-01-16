
export interface IEventMouse extends MouseEvent {
    latLng: google.maps.LatLng;
    latlng: L.LatLng;
    placeId: string;
    stop(): void;
    point: BMap.Point;
    get: any;
    stopPropagation(): void
}
