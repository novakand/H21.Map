import { OnChanges, OnDestroy, Directive, Input, AfterViewInit } from "@angular/core";
import { MapManager } from "../dto/manager/map-manager";

@Directive({
    selector: 'h21-map-route'
})

export class H21MaRouteDirective implements AfterViewInit, OnChanges, OnDestroy {

    constructor(private manager: MapManager) { }

    @Input() latitude: number;

    @Input() longitude: number;

    private _routeAddService: boolean = false;

    ngAfterViewInit(): void {

    }
    ngOnDestroy(): void {

    }

    ngOnChanges() {

        if (!this.manager.getMap().route) { return; }
        if (!this._routeAddService) { return; }

    }
}