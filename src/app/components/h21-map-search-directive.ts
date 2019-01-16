import { OnChanges, OnDestroy, Directive, Input, Output, AfterViewInit } from "@angular/core";
import { MapManager } from "../dto/manager/map-manager";
import { Subject, Observable } from "rxjs";
import { IPoint } from "../dto/interfaces/i-point";

@Directive({
    selector: 'h21-map-search'
})

export class H21MaSearchDirective implements AfterViewInit, OnChanges, OnDestroy {

    constructor(private manager: MapManager) { }

    @Input() query: string;

    @Input() language: string;

    @Input() countPlace: string;

    @Output() searchResponce: Subject<IPoint[]> = new Subject<IPoint[]>();

    private _searchAddService: boolean = false;

    ngAfterViewInit(): void {

    }
    ngOnDestroy(): void {

    }

    ngOnChanges() {

        if (!this.manager.getMap().search) { return; }
        if (!this._searchAddService) { return; }
        this.searcPlace(this.query);
    }

    searcPlace(query): Observable<IPoint> {
        return new Observable(() => {
            this.manager.getMap().search.searchPlace(query).subscribe((arrayPoint) => {
                this.searchResponce.next(<IPoint[]>arrayPoint);
            });
        });
    }
}