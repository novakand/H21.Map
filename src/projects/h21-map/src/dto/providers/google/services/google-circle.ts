import { Injectable, NgZone } from "@angular/core";
import { CircleService } from "../../../services/abstract-circle";
import { H21MapCircleDirective } from "projects/h21-map/src/components/h21-map-circle.directive";
import { ICircleOptions } from "../../../interfaces/i-circle-options";
import { IPosition } from "../../../interfaces/i-position";
import { Observable, Observer } from "rxjs";

@Injectable()
export class GoogleCircleService extends CircleService<google.maps.Map, google.maps.Marker> {

    constructor(private _zone: NgZone) {
        super();
    }

    private _circle: Map<H21MapCircleDirective, google.maps.Circle> = new Map<H21MapCircleDirective, google.maps.Circle>();

    addCicrle(circle: H21MapCircleDirective): void {

        this.map.createCircle(this.createCircleOptions(circle)).subscribe(googleCircle => {
            this._circle.set(circle, googleCircle);
        });

        this._circle.get(circle).setMap(this.map.api);

        if (circle.fitBounds) {
            this.fitBounds(circle);
        }

    }

    setRadius(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setRadius(circle.radius);
    }

    setDraggable(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setDraggable(circle.enableDraggable);
    }

    setEditable(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setEditable(circle.enableEditable);
    }

    setFillColor(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setOptions({ fillColor: circle.fillColor });
    }

    setFillOpacity(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setOptions({ fillOpacity: circle.fillOpacity });
    }

    setStrokeColor(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setOptions({ strokeColor: circle.strokeColor });
    }

    setStrokeOpacity(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setOptions({ strokeOpacity: circle.strokeOpacity });
    }

    setStrokeWeight(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setOptions({ strokeWeight: circle.strokeWeight });
    }

    setCenter(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setCenter(new google.maps.LatLng(circle.latitude, circle.longitude));
    }

    setVisible(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setVisible(circle.enableVisible);
    }

    removeCircle(circle: H21MapCircleDirective): void {
        return this._zone.run(() => {
            this._circle.get(circle).setMap(null);
            this._circle.delete(circle);
        });
    }

    fitBounds(circle: H21MapCircleDirective): void {
        this.map.api.fitBounds(this._circle.get(circle).getBounds());
    }

    getRadius(circle: H21MapCircleDirective): number {
        return this._circle.get(circle).getRadius();
    }
   
    createEvent<T>(eventName: string, circle: H21MapCircleDirective): Observable<T> {
        return Observable.create((observer: Observer<T>) => {
            this._circle.get(circle).addListener(eventName, (event: T) => this._zone.run(() => observer.next(event)))
        });
    }

}