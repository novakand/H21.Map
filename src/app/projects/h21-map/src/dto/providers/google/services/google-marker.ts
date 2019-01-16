
import { Injectable, NgZone } from "@angular/core";
import { MarkerService } from "../../../services/abstract-marker";
import { H21MapMarkerDirective } from "projects/h21-map/src/components/h21-map-marker.directive";
import { Observable, Observer } from "rxjs";
import { CallbackName } from "../../../enum/e-callback-name";

@Injectable()

export class GoogleMarkerService extends MarkerService<google.maps.Map, google.maps.Marker> {

    constructor(private _zone: NgZone) { super(); }

    markers: Map<H21MapMarkerDirective, google.maps.Marker> = new Map<H21MapMarkerDirective, google.maps.Marker>();

    addMarker(marker: H21MapMarkerDirective): void {

        this.map.createMarker(this.createMarkerOptions(marker)).subscribe(googleMarker => {
            this.markers.set(marker, googleMarker);
        });

        if (marker.inCluster) {
            this.map.cluster.addMarker(marker);
        }

        else {

            this.markers.get(marker).setMap(this.map.api);
            if (marker.fitBonds) {
                this.fitBounds();
            }
        }

        super.addMarker();

    }


    setIcon(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setIcon(marker.iconUrl);
    }

    setPosition(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setPosition(new google.maps.LatLng(marker.latitude, marker.longitude));
    }

    setTitle(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setTitle(marker.title);

    }

    setLabel(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setLabel(marker.label)
    }

    setVisible(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setVisible(marker.enableVisible);
    }

    setDraggable(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setDraggable(marker.enableDraggable);
    }

    setOpacity(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setOpacity(marker.opacity);
    }

    setCursor(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setCursor(null);
    }

    setZIndex(marker: H21MapMarkerDirective) {
        this.markers.get(marker).setZIndex(marker.zIndex);
    }

    removeMarker(marker: H21MapMarkerDirective): void {

        return this._zone.run(() => {
            if (marker.inCluster) {
                this.map.cluster.removeMarker(marker);
            }
            else {
                this.markers.get(marker).setMap(null);
                this.markers.delete(marker);
                this.map.callbackMap.emit(CallbackName.countLoadMarkers, this.markers.size);
            }

        });
    }

    setClickable(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setClickable(marker.enableClickable);
    }

    createEvent<E>(eventName: string, marker: H21MapMarkerDirective): Observable<E> {
        return Observable.create((observer: Observer<E>) => {
            this.markers.get(marker).addListener(eventName, (event: E) => this._zone.run(() => observer.next(event)))
        });
    }

    private fitBounds(): void {

        let bounds = new google.maps.LatLngBounds();

        this.markers.forEach(marker => {
            bounds.extend(marker.getPosition());
        });

        this.map.api.fitBounds(bounds);
        this.map.api.panToBounds(bounds);

    }
}
