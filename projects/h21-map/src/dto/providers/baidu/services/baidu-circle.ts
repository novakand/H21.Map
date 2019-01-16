import { Injectable, NgZone } from "@angular/core";
import { CircleService } from "../../../services/abstract-circle";
import { H21MapCircleDirective } from "projects/h21-map/src/components/h21-map-circle.directive";
import { Observable, Observer } from "rxjs";
import { ICircleOptions } from "../../../interfaces/i-circle-options";
import { IPosition } from "../../../interfaces/i-position";


@Injectable()
export class BaiduCircleService extends CircleService<BMap.Map, BMap.Marker> {

    constructor(private _zone: NgZone) {
        super();
    }

    private _circle: Map<H21MapCircleDirective, BMap.Circle> = new Map<H21MapCircleDirective, BMap.Circle>();


    addCicrle(circle: H21MapCircleDirective): void {

        this.map.createCircle(this.createCircleOptions(circle)).subscribe(baidyCircle => {
            this._circle.set(circle, baidyCircle);
        });

        this.map.api.addOverlay(this._circle.get(circle));
        if (circle.fitBounds) {
            this.fitBounds(circle);
        }

    }

    setFillColor(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setFillColor(circle.fillColor);
    }
    setVisible(circle: H21MapCircleDirective): void {
        circle.enableVisible ? this._circle.get(circle).hide() : this._circle.get(circle).show();
    }

    setRadius(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setRadius(circle.radius);
    }

    setEditable(circle: H21MapCircleDirective): void {
        circle.enableEditable ? this._circle.get(circle).enableEditing() : this._circle.get(circle).disableEditing();
    }

    setDraggable(circle: H21MapCircleDirective): void {

    }

    removeCircle(circle: H21MapCircleDirective): void {
        return this._zone.run(() => {
            this.map.api.removeOverlay(this._circle.get(circle));
            this._circle.delete(circle);
        });
    }

    setFillOpacity(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setFillOpacity(circle.fillOpacity);
    }

    setStrokeColor(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setStrokeOpacity(Number(circle.strokeColor));
    }

    setStrokeOpacity(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setStrokeOpacity(circle.strokeOpacity);
    }

    setStrokeWeight(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setStrokeWeight(circle.strokeWeight);
    }

    setCenter(circle: H21MapCircleDirective): void {
        this._circle.get(circle).setCenter(new BMap.Point(circle.longitude, circle.latitude));
    }

    getRadius(circle: H21MapCircleDirective): number {
        return this._circle.get(circle).getRadius();
    }

    fitBounds(circle: H21MapCircleDirective): void {
        this.map.api.setViewport(this._circle.get(circle).getBounds());
    }

    createEvent<T>(eventName: string, circle: H21MapCircleDirective): Observable<T> {
        return Observable.create((observer: Observer<T>) => {
            this._circle.get(circle).addEventListener(eventName, (event: T) => this._zone.run(() => observer.next(event)))
        });
    }
}