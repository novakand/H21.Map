import { Injectable } from "@angular/core";
import { MapService } from "./abstract-map";
import { H21MapCircleDirective } from "../../components/h21-map-circle.directive";
import { Observable } from "rxjs";
import { ICircleOptions } from "../interfaces/i-circle-options";


@Injectable()
export abstract class CircleService<T, U> {

    map: MapService<T, U>;

    initMap(map: MapService<T, U>): void {
        this.map = map;
    }

    abstract addCicrle(circle: H21MapCircleDirective): void

    createCircleOptions(circle: H21MapCircleDirective): ICircleOptions {

        const options = <ICircleOptions>{
            fillColor: circle.fillColor,
            strokeColor: circle.strokeColor,
            strokeOpacity: circle.strokeOpacity,
            strokeWeight: circle.strokeWeight,
            fillOpacity: circle.fillOpacity,
            center: { latitude: circle.latitude, longitude: circle.longitude },
            radius: circle.radius,
            draggable: circle.enableDraggable,
            editable: circle.enableEditable,
        }

        return options;

    }
    abstract setRadius(circle: H21MapCircleDirective): void;

    abstract setEditable(circle: H21MapCircleDirective): void;

    abstract setDraggable(circle: H21MapCircleDirective): void;

    abstract removeCircle(circle: H21MapCircleDirective): void;

    abstract setFillOpacity(circle: H21MapCircleDirective): void;

    abstract setFillColor(circle: H21MapCircleDirective): void;

    abstract setStrokeColor(circle: H21MapCircleDirective): void;

    abstract setStrokeOpacity(circle: H21MapCircleDirective): void;

    abstract setStrokeWeight(circle: H21MapCircleDirective): void;

    abstract setCenter(circle: H21MapCircleDirective): void;

    abstract fitBounds(circle: H21MapCircleDirective): void;

    abstract getRadius(circle: H21MapCircleDirective): number;

    abstract setVisible(circle: H21MapCircleDirective): void;

    abstract createEvent<A>(eventName: string, marker: H21MapCircleDirective): Observable<A>;
}