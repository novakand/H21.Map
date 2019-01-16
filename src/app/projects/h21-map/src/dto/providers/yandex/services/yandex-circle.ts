import { Injectable, NgZone } from "@angular/core";
import { CircleService } from "../../../services/abstract-circle";
import { H21MapCircleDirective } from "projects/h21-map/src/components/h21-map-circle.directive";
import { Observable, Observer } from "rxjs";
import { IPosition } from "../../../interfaces/i-position";

@Injectable()
export class YandexCircleService extends CircleService<ymaps.Map, ymaps.GeoObject> {

    constructor(private _zone: NgZone) {
        super();

    }

    private _circle: Map<H21MapCircleDirective, ymaps.Circle> = new Map<H21MapCircleDirective, ymaps.Circle>();

    addCicrle(circle: H21MapCircleDirective): void {

        this.map.createCircle(this.createCircleOptions(circle)).subscribe(ymapsCircle => {
            this._circle.set(circle, ymapsCircle);

        });

        this.map.api.geoObjects.add(this._circle.get(circle));
        this.setEditable(circle);

        if (circle.fitBounds) {
            this.fitBounds(circle);
        }
    }

    setFillColor(circle: H21MapCircleDirective): void {
        this._circle.get(circle).options.set({
            fillColor: circle.fillColor,
        });
    }

    setVisible(circle: H21MapCircleDirective): void {
        this._circle.get(circle).options.set({
            visible: circle.enableVisible,
        });
    }

    removeCircle(circle: H21MapCircleDirective): void {
        return this._zone.run(() => {
            this.map.api.geoObjects.remove(this._circle.get(circle));
            this._circle.delete(circle);
        });
    }

    setFillOpacity(circle: H21MapCircleDirective): void {
        this._circle.get(circle).options.set({
            fillOpacity: circle.fillOpacity,
        });
    }

    setStrokeColor(circle: H21MapCircleDirective): void {
        this._circle.get(circle).options.set({
            strokeOpacity: circle.strokeOpacity,
        });
    }

    setStrokeOpacity(circle: H21MapCircleDirective): void {
        this._circle.get(circle).options.set({
            strokeOpacity: circle.strokeOpacity,
        });
    }

    setStrokeWeight(circle: H21MapCircleDirective): void {
        this._circle.get(circle).options.set({
            strokeWidth: circle.strokeWeight,
        });
    }

    setCenter(circle: H21MapCircleDirective): void {
        this._circle.get(circle).geometry.setCoordinates([circle.latitude, circle.latitude]);
    }

    getRadius(circle: H21MapCircleDirective): number {

        return this._circle.get(circle).geometry.getRadius(circle.radius);
    }

    setRadius(circle: H21MapCircleDirective): void {
        this._circle.get(circle).geometry.setRadius(circle.radius);
    }

    setEditable(circle: H21MapCircleDirective): void {
        circle.enableEditable ? this._circle.get(circle).editor.startEditing() : this._circle.get(circle).editor.stopEditing();
    }

    setDraggable(circle: H21MapCircleDirective): void {
        this._circle.get(circle).options.set({
            draggable: circle.enableDraggable,
        });
    }

    fitBounds(circle: H21MapCircleDirective): void {
        this.map.api.setBounds(this._circle.get(circle).geometry.getBounds());
    }

    createEvent<T>(eventName: string, circle: H21MapCircleDirective): Observable<T> {
        return Observable.create((observer: Observer<any>) => {
            this._circle.get(circle).events.add(eventName, (event) => this._zone.run(() => observer.next(event)))
        });

    }
}