import { OnChanges, OnDestroy, Directive, Input, Output, SimpleChange, AfterViewInit } from "@angular/core";
import { Observable, Observer, Subject } from "rxjs";
import { MapManager } from "../dto/manager/map-manager";
import { IPosition } from "../dto/interfaces/i-position";
import { IPoint } from "../dto/interfaces/i-point";

@Directive({
    selector: 'h21-map-geocoding'
})

export class H21MaGeocodingDirective implements AfterViewInit, OnChanges, OnDestroy {

    constructor(private manager: MapManager) { }

    @Input() latitude: number;

    @Input() longitude: number;

    @Input() address: string;

    @Output() directGeocodingResponse: Subject<IPosition> = new Subject<IPosition>();

    @Output() reverseGeocodingResponse: Subject<IPoint> = new Subject<IPoint>();

    private _geocodingService: boolean = false;

    ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }

    ngAfterViewInit() {
        if (!this.manager.getMap().geocoding) { return; }
        if (!this._geocodingService) {

        }
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {

        if (!this.manager.getMap().geocoding) { return; }

        if (!this._geocodingService) { return; }

        if (changes['latitude'] || changes['longitude']) {
            this.getAddress(this.latitude, this.longitude);
        }
        if (changes['address']) {
            this.getCoordinates(this.address);
        }
    }

    getCoordinates(address) {
        return new Observable((observer: Observer<IPosition>) => {
            this.manager.getMap().geocoding.getCoordinates(address).subscribe((position) => {
                this.directGeocodingResponse.next(<IPosition>position);
                observer.next(<IPosition>position);
            });
        });
    }

    getAddress(latitude, longitude) {
        return new Observable((observer: Observer<IPoint>) => {
            this.manager.getMap().geocoding.getAddress(latitude, longitude).subscribe((address) => {
                this.reverseGeocodingResponse.next(<IPoint>address);
                observer.next(<IPoint>address);
            });
        });
    }
}