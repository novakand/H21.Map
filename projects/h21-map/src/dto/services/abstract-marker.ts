import { Injectable } from "@angular/core";
import { MapService } from "./abstract-map";
import { H21MapMarkerDirective } from "../../components/h21-map-marker.directive";
import { Observable } from "rxjs";
import { IIcon } from "../interfaces/i-icon";
import { CallbackName } from "../enum/e-callback-name";
import { IMarkerOptions } from "../interfaces/i-marker-options";



@Injectable()
export abstract class MarkerService<T, U> {

    map: MapService<T, U>;

    markers: Map<H21MapMarkerDirective, U> = new Map<H21MapMarkerDirective, U>();

    initMap(map: MapService<T, U>): void {
        this.map = map;
    }

    addMarker(marker?: H21MapMarkerDirective): void {

        this.map.callbackMap.emit(CallbackName.countLoadMarkers, this.markers.size);
    }

    createMarkerOptions(marker: H21MapMarkerDirective): IMarkerOptions {

        const icon = <IIcon>{
            width: marker.width,
            height: marker.height,
            url: marker.iconUrl
        }

        const options = <IMarkerOptions>{
            label: marker.label,
            position: { latitude: marker.latitude, longitude: marker.longitude },
            title: marker.title,
            draggable: marker.enableDraggable,
            icon: icon,
            opacity: marker.opacity,
            optimized: true,
            visible: marker.enableVisible,
            clickable: marker.enableClickable
        }

        return options;
    }

    abstract setTitle(marker: H21MapMarkerDirective): void;

    abstract setDraggable(marker: H21MapMarkerDirective): void;

    abstract setLabel(marker: H21MapMarkerDirective): void;

    abstract setIcon(marker: H21MapMarkerDirective): void;

    abstract setCursor(marker: H21MapMarkerDirective): void;

    abstract setZIndex(marker: H21MapMarkerDirective): void;

    abstract setClickable(marker: H21MapMarkerDirective): void;

    abstract setOpacity(marker: H21MapMarkerDirective): void;

    abstract setPosition(marker: H21MapMarkerDirective): void;

    abstract setVisible(marker: H21MapMarkerDirective): void;

    abstract removeMarker(marker: H21MapMarkerDirective): void;

    abstract createEvent<E>(eventName: string, marker: H21MapMarkerDirective): Observable<E>;

}