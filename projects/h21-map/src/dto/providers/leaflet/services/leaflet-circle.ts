import { CircleService } from "../../../services/abstract-circle";
import { Observable, Observer } from "rxjs";
import { H21MapCircleDirective } from "projects/h21-map/src/components/h21-map-circle.directive";
import { NgZone, Injectable } from "@angular/core";

declare var Editable: any;

@Injectable()
export class LeafletCircleService extends CircleService<L.Map, L.Marker> {

    constructor(private _zone: NgZone) {
        super();
    }

    private _circle: Map<H21MapCircleDirective, L.Circle> = new Map<H21MapCircleDirective, L.Circle>();

    addCicrle(circle: H21MapCircleDirective): void {

        this.map.createCircle(this.createCircleOptions(circle)).subscribe(lCircle => {
            this._circle.set(circle, lCircle)

            this.map.api.addLayer(this._circle.get(circle));

            if (circle.fitBounds) {
                this.fitBounds(circle);
            }

        });
    }
    setRadius(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setRadius(circle.radius);
    }

    setEditable(circle: H21MapCircleDirective): void {
     circle.enableEditable ? this._circle.get(circle).enableEdit() : this._circle.get(circle).disableEdit();
    }

    setDraggable(circle: H21MapCircleDirective): void {
    }

    removeCircle(circle: H21MapCircleDirective): void {
        return this._zone.run(() => {
            this.map.api.removeLayer(this._circle.get(circle));
            this._circle.delete(circle);
        });
    }

    setFillOpacity(circle: H21MapCircleDirective): void {
        const options = <L.CircleMarkerOptions>{
            fillOpacity: circle.fillOpacity
        }
        this._circle.get(circle).setStyle(options);
    }

    setFillColor(circle: H21MapCircleDirective): void {
        const options = <L.CircleMarkerOptions>{
            fillColor: circle.fillColor
        }
        this._circle.get(circle).setStyle(options);
    }

    setStrokeColor(circle: H21MapCircleDirective): void {
        const options = <L.CircleMarkerOptions>{
            color: circle.strokeColor
        }
        this._circle.get(circle).setStyle(options);
    }

    setStrokeOpacity(circle: H21MapCircleDirective): void {
        const options = <L.CircleMarkerOptions>{
            opacity: circle.strokeOpacity
        }
        this._circle.get(circle).setStyle(options);
    }

    setStrokeWeight(circle: H21MapCircleDirective): void {
        const options = <L.CircleMarkerOptions>{
            weight: circle.strokeWeight
        }
        this._circle.get(circle).setStyle(options);
    }

    setCenter(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setLatLng([circle.latitude, circle.longitude]);
    }

    fitBounds(circle: H21MapCircleDirective): void {
        this.map.api.fitBounds(this._circle.get(circle).getBounds());
    }

    getRadius(circle: H21MapCircleDirective): number {
        return this._circle.get(circle).getRadius();
    }

    getCenter(circle: H21MapCircleDirective): void {
        this._circle.get(circle).getLatLng();
    }

    setVisible(circle: H21MapCircleDirective): void {
        circle.enableVisible ? this._circle.get(circle).enable() : this._circle.get(circle).disable();

    }

    createEvent<A>(eventName: string, circle: H21MapCircleDirective): Observable<A> {
        return Observable.create((observer: Observer<any>) => {
            this._circle.get(circle).addEventListener(eventName, (event) => this._zone.run(() => observer.next(event)));
        });
    }

}