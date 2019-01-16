
import { Injectable, NgZone } from "@angular/core";
import { MarkerService } from "../../../services/abstract-marker";
import { H21MapMarkerDirective } from "projects/h21-map/src/components/h21-map-marker.directive";
import { Observable, Observer } from "rxjs";
import { CallbackName } from "../../../enum/e-callback-name";

@Injectable()
export class BaiduMarkerService extends MarkerService<BMap.Map, BMap.Marker> {
  

    markers: Map<H21MapMarkerDirective, BMap.Marker> = new Map<H21MapMarkerDirective, BMap.Marker>();


    constructor(private _zone: NgZone) { super() }

    addMarker(marker: H21MapMarkerDirective): void {

        this.map.createMarker(this.createMarkerOptions(marker)).subscribe(baiduMarker => {
            this.markers.set(marker, baiduMarker);
        });

        if (marker.inCluster) {
            this.map.cluster.addMarker(marker);
        }

        else {
            this.map.api.addOverlay(this.markers.get(marker));
            if (marker.fitBonds) {
                this.fitBounds();
            }
        }

    }

    setTitle(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setTitle(marker.title);
    }

    setDraggable(marker: H21MapMarkerDirective): void {
        marker.enableDraggable ? this.markers.get(marker).enableDragging() : this.markers.get(marker).disableDragging();
    }

    setLabel(marker: H21MapMarkerDirective) {
        this.markers.get(marker).setLabel(new BMap.Label(marker.label));
    }

    setIcon(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setIcon(new BMap.Icon(marker.iconUrl, new BMap.Size(marker.width, marker.height)))
    }

    setZIndex(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setZIndex(marker.zIndex);
    }

    setClickable(marker: H21MapMarkerDirective): void {
        throw new Error("Method not implemented.");
    }
    
    setOpacity(marker: H21MapMarkerDirective): void {
        throw new Error("Method not implemented.");
    }

    setPosition(marker: H21MapMarkerDirective): void {
        this.markers.get(marker).setPosition(new BMap.Point(marker.longitude, marker.latitude));
    }

    setVisible(marker: H21MapMarkerDirective): void {
        marker.enableVisible ? this.markers.get(marker).show() : this.markers.get(marker).hide();
    }

    setCursor(marker: H21MapMarkerDirective): void {

    }

    removeMarker(marker: H21MapMarkerDirective): void {
        return this._zone.run(() => {
            if (marker.inCluster) {
                this.map.cluster.removeMarker(marker);
            }
            else {
                this.map.api.removeOverlay(this.markers.get(marker));
                this.map.callbackMap.emit(CallbackName.countLoadMarkers, this.markers.size);
            }

        });
    }

    createEvent<E>(eventName: string, marker: H21MapMarkerDirective): Observable<E> {
        return Observable.create((observer: Observer<E>) => {
            this.markers.get(marker).addEventListener(eventName, (event: E) => this._zone.run(() => observer.next(event)))
        });
    }

    private fitBounds(): void {
        let bounds = []
        this.markers.forEach(marker => {
            bounds.push(marker.getPosition());

        });
        this.map.api.setViewport(bounds);
    }

}
