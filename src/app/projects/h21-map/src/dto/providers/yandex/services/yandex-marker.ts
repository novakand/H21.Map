import { Injectable, NgZone } from "@angular/core";
import { MarkerService } from "../../../services/abstract-marker";
import { H21MapMarkerDirective } from "projects/h21-map/src/components/h21-map-marker.directive";
import { Observable, Observer } from "rxjs";

@Injectable()
export class YandexMarkerService extends MarkerService<ymaps.Map, ymaps.GeoObject> {

    constructor(private _zone: NgZone) {
        super();

    }

    markers: Map<H21MapMarkerDirective, ymaps.GeoObject> = new Map<H21MapMarkerDirective, ymaps.GeoObject>();

    addMarker(marker: H21MapMarkerDirective): void {

        this.map.createMarker(this.createMarkerOptions(marker)).subscribe(ymapsMarker => {
            this.markers.set(marker, ymapsMarker);

        });

        if (marker.inCluster) {
            this.map.cluster.addMarker(marker);
        }

        else {
            this.map.api.geoObjects.add(this.markers.get(marker));
            if (marker.fitBonds) {
                this.fitBounds();
            }
        }
    }

    setTitle(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).properties.set({
            hintContent: marker.title,
        }, {});
    }

    setDraggable(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).options.set({
            draggable: true,
        });
    }

    setLabel(marker: H21MapMarkerDirective): void {

    }

    setOpacity(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).options.set({
            opacity: marker.opacity,
        });
    }

    setIcon(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).options.set({
            iconImageHref: marker.iconUrl,
            iconImageSize: [marker.height, marker.width]
        });
    }

    setCursor(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).options.set({
            cursor: marker.cursor,
        });
    }

    setZIndex(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).options.set({
            zIndex: marker.zIndex,
        });
    }

    setClickable(marker: H21MapMarkerDirective): void {

    }

    setPosition(marker: H21MapMarkerDirective): void {
    }

    setVisible(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).options.set({
            visible: marker.enableVisible,
        });
    }

    removeMarker(marker: H21MapMarkerDirective): void {
        this.map.api.geoObjects.remove(this.markers.get(marker));
    }

    fitBounds() {
        this.map.api.setBounds(this.map.api.geoObjects.getBounds());
    }

    createEvent<E>(eventName: string, marker: H21MapMarkerDirective): Observable<E> {
        return Observable.create((observer: Observer<any>) => {
            this.markers.get(marker).events.add(eventName, (event) => this._zone.run(() => observer.next(event)))
        });

    }

}