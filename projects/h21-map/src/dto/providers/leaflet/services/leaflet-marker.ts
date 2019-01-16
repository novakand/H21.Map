import { Injectable, NgZone } from "@angular/core";
import { MarkerService } from "../../../services/abstract-marker";
import { Observable, Observer } from "rxjs";
import { H21MapMarkerDirective } from "projects/h21-map/src/components/h21-map-marker.directive";
import { CallbackName } from "../../../enum/e-callback-name";

@Injectable()
export class LeafletMarkerService extends MarkerService<L.Map, L.Marker> {

    markers: Map<H21MapMarkerDirective, L.Marker> = new Map<H21MapMarkerDirective, L.Marker>();

    constructor(private _zone: NgZone) {
        super();

    }

    addMarker(marker: H21MapMarkerDirective): void {

        this.map.createMarker(this.createMarkerOptions(marker)).subscribe(m => {
            this.markers.set(marker, m);

        });

        if (marker.inCluster) {

            this.map.cluster.addMarker(marker);
        }
        else {

            this.map.api.addLayer(this.markers.get(marker));
            if (marker.fitBonds) {
                this.fitBounds();
            }
        }

    }
    setTitle(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setTooltipContent(marker.title);
    }

    setDraggable(marker: H21MapMarkerDirective): void {
     //   marker.draggable ? this.markers.get(marker).disable() : this.markers.get(marker).dragging.enable();
    }

    setLabel(marker: H21MapMarkerDirective): void {

    }

    setOpacity(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setOpacity(marker.opacity);
    }

    setIcon(marker: H21MapMarkerDirective): void {
        const icon = L.icon({
            iconUrl: marker.iconUrl,
            iconSize: [marker.height, marker.width],
        });
        this.markers.get(marker).setIcon(icon);
    }

    setCursor(marker: H21MapMarkerDirective): void {

    }

    setZIndex(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setZIndexOffset(marker.zIndex);
    }

    setClickable(marker: H21MapMarkerDirective): void {
    }

    setPosition(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setLatLng([marker.latitude, marker.longitude]);
    }

    setVisible(marker: H21MapMarkerDirective): void {

    }

    removeMarker(marker: H21MapMarkerDirective): void {
        return this._zone.run(() => {
            if (marker.inCluster) {
                this.map.cluster.removeMarker(marker);
            }
            else {
                this.map.api.removeLayer(this.markers.get(marker));
                this.markers.delete(marker);
                this.map.callbackMap.emit(CallbackName.countLoadMarkers, this.markers.size);
            }

        });
    }

    createEvent<E>(eventName: string, marker: H21MapMarkerDirective): Observable<E> {
        return Observable.create((observer: Observer<any>) => {
            this.markers.get(marker).addEventListener(eventName, (event) => { this._zone.run(() => observer.next(event)) });
        });
    }

    fitBounds() {

        let bounds = []
        this.markers.forEach(marker => {
            bounds.push(marker.getLatLng());
        });

        this.map.api.fitBounds(bounds);
    }
}