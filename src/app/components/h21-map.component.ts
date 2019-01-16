import { Component, Output, Injectable, Input, OnInit, ViewChild, ElementRef, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { MapType } from '../dto/enum/e-map-type';
import { MapManager } from '../dto/manager/map-manager';
import { IPosition } from '../dto/interfaces/i-position';
import { IMapOptions } from '../dto/interfaces/i-map-options';
import { CursorType } from '../dto/providers/google/enum/e-cursor-type';
import { Subject, Observable, Observer } from 'rxjs';
import { MatButtonToggleGroup } from '@angular/material';
import { CallbackName } from '../dto/enum/e-callback-name';
import { IBounds, EventType } from '../dto';

@Injectable()
@Component({
    selector: 'h21-map',
    template: `<div class="c-h21-map">
    <div class="c-h21-map-toolbar">
    <mat-button-toggle-group class="c-h21-map-toolbar_btn-group" *ngIf ="enableToolbar" #toolbar="matButtonToggleGroup" [vertical]="true">
        <mat-button-toggle matTooltip="Set area" matTooltipPosition="left" style="display:none;" class="c-h21-map-toolbar_btn" value="area"
            (click)="changeButtonGroup('area')">
            <mat-icon class="primary">rounded_corner</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle matTooltip="Set circle" matTooltipPosition="left" class="c-h21-map-toolbar_btn" value="circle"
        (click)="changeButtonGroup('circle')">
            <mat-icon class="primary">panorama_fish_eye</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle matTooltip="Set marker" matTooltipPosition="left" class="c-h21-map-toolbar_btn" value="marker"
        (click)="changeButtonGroup('marker')">
            <mat-icon class="primary">place</mat-icon>
        </mat-button-toggle>
    </mat-button-toggle-group>
</div>
   <div class="c-h21-map-container" id="map" #container></div>
   <div class='map-content'>
            <ng-content></ng-content>
        </div>
    </div>`,
    styles: [`
    .map-content { display:none; }
`],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class H21MapComponent implements OnInit, OnChanges, OnDestroy {

    constructor(public manager: MapManager) { }

    private _MapAddService = false;

    @ViewChild('container') private _container: ElementRef;

    @ViewChild('toolbar') private _toolbar: MatButtonToggleGroup;

    @Input() enableResetToolbar: boolean = false;

    @Input() enableToolbar: boolean = false;

    @Input() provider: MapType;

    @Input() longitude: number = 0;

    @Input() latitude: number = 0;

    @Input() zoom: number = 3;

    @Input() minZoom: number = 2;

    @Input() maxZoom: number = 22;

    @Input() enableDraggable: boolean = true;

    @Input() enableClick: boolean = true;

    @Input() enableDoubleClickZoom: boolean = true;

    @Input() enableDefaultControl: boolean = false;

    @Input() enableScrollwheel: boolean = true;

    @Input() defaultCursor: CursorType = CursorType.default;

    @Input() enableTrafficLayer: boolean = false;

    @Input() enableTransitLayer: boolean = false;

    @Output() boundsChange: Subject<IBounds> = new Subject<IBounds>();

    @Output() mapClick: Subject<IPosition> = new Subject<IPosition>();

    @Output() mapDblClick: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() mapRightClick: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() mapMouseOver: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() mapMouseOut: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() mapMouseDown: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() mapMouseUp: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() mapMouseMove: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() mapReady: Subject<any> = new Subject<any>();

    @Output() zoomChange: Subject<Number> = new Subject<Number>();

    @Output() countLoadsMarkers: Subject<Number> = new Subject<Number>();

    @Output() responseMapError: Subject<string> = new Subject<string>();

    @Output() geolocationChange: Subject<IPosition> = new Subject<IPosition>();

    @Output() onChangedToolbar: Subject<string> = new Subject<string>();

    changeButtonGroup(type: string) {
        this.onChangedToolbar.next(type);
    }

    ngOnInit() {

        this.selectedProvider();
        this.initMapInstance();
        this.setCallback();
    }

    private selectedProvider() {
        try {
            if (this.provider) {
                switch (this.provider) {
                    case MapType.BAIDU:
                        this.selectedMap(MapType.BAIDU);
                        break;
                    case MapType.YANDEX:
                        this.selectedMap(MapType.YANDEX);
                        break;
                    case MapType.LEAFLET:
                        this.selectedMap(MapType.LEAFLET);
                        break;
                    default:
                        this.selectedMap(MapType.GOOGLE);
                        break;
                }
            }
        } catch (err) {

        }
    }

    private selectedMap(type: MapType) {
        try {

            this.manager.changeType(type);
            this.manager.selectMap(type);

        } catch (err) {

        }
    }

    private initMapInstance() {
        const center = <IPosition>{
            latitude: this.latitude || 0,
            longitude: this.longitude || 0
        }
        const options = <IMapOptions>{
            center: center,
            enableDefaultControl: this.enableDefaultControl || false,
            zoom: this.zoom || 3,
            minZoom: this.minZoom || 3,
            maxZoom: this.maxZoom || 22,
            defaultCursor: this.defaultCursor,
            enableDraggable: this.enableDraggable,
            enableScrollwheel: this.enableScrollwheel,
            enableDoubleClickZoom: this.enableDoubleClickZoom
        }

        this.manager.getMap().loadAPI().subscribe(() => {
            this.manager.getMap().createMap(this._container.nativeElement, options);
            this._MapAddService = true;
            this.addEventListeners();
            this.addEventListenerBoundsChange();
            this.addEventListenerZoomChange();
            this.addEventListenerClick();
            this.updateOptions();
            this.mapReady.next();
        });
    }

    private addEventListeners(): void {

        this.manager.getMap().events.createEvent(EventType.dblClick).subscribe(event => {
            this.mapDblClick.next(<MouseEvent>event);
        });
        this.manager.getMap().events.createEvent(EventType.rightClick).subscribe(event => {
            this.mapRightClick.next(<MouseEvent>event);
        });
        this.manager.getMap().events.createEvent(EventType.mouseOver).subscribe(event => {
            this.mapMouseOver.next(<MouseEvent>event);
        });
        this.manager.getMap().events.createEvent(EventType.mouseOut).subscribe(event => {
            this.mapMouseOut.next(<MouseEvent>event);
            this.manager.getMap().infoBox.close();
        });
        this.manager.getMap().events.createEvent(EventType.mouseMove).subscribe(event => {
            this.mapMouseMove.next(<MouseEvent>event);
        });

        this.manager.getMap().events.createEvent(EventType.mouseUp).subscribe(event => {
            this.mapMouseUp.next(<MouseEvent>event);
        });

        this.manager.getMap().events.createEvent(EventType.mouseDown).subscribe(event => {
            this.mapMouseDown.next(<MouseEvent>event);
        });
    }

    private addEventListenerZoomChange(): void {
        this.manager.getMap().events.createEventZoomChange().subscribe((zoom) => {
            this.zoomChange.next(<number>zoom);
            this.manager.getMap().infoBox.close();
        });
    }

    private addEventListenerBoundsChange(): void {
        this.manager.getMap().events.createEventBoundsChange().subscribe((bounds) => {
            this.boundsChange.next(<IBounds>bounds);
        });
    }

    private addEventListenerClick(): void {
        this.manager.getMap().events.createEvent<any>(EventType.click).subscribe((event) => {
            console.log('click')
            if (this.enableClick) {
                this.mapClick.next(<IPosition>this.manager.getMap().conversions.translatePosition(event));
            }
        });
    }

    private updateOptions() {
        this.manager.getMap().setTransitLayer(this.enableTransitLayer);
        this.manager.getMap().setTrafficLayer(this.enableTrafficLayer);
    }

    private setCallback() {
        this.manager.getMap().callbackMap.on(CallbackName.countLoadMarkers, (countLoadMarkers) => {
            this.countLoadsMarkers.next(<number>countLoadMarkers);
        });

        this.manager.getMap().callbackMap.on(CallbackName.responseMapError, (status) => {
            this.responseMapError.next(<string>status);
        });
    }

    ngOnChanges(changes: SimpleChanges) {

        if (!this._MapAddService) { return; }
        if (!this.manager.getMap()) { return; }

        if (changes['latitude'] || changes['longitude']) {
            this.manager.getMap().setCenter(this.latitude, this.longitude);
        }
        if (changes['zoom']) {
            this.manager.getMap().setZoom(this.zoom);
        }
        if (changes['minZoom']) {
            this.manager.getMap().setMinZoom(this.minZoom);
        }
        if (changes['maxZoom']) {
            this.manager.getMap().setMaxZoom(this.maxZoom);
        }
        if (changes['scrollwheel']) {
            this.manager.getMap().setScrollwheel(this.enableScrollwheel);
        }
        if (changes['defaultCursor']) {
            this.manager.getMap().setDefaultCursor(this.defaultCursor);
        }
        if (changes['click']) {
            this.manager.getMap().setClick(this.enableClick);
        }
        if (changes['disableDoubleClickZoom']) {
            this.manager.getMap().setDoubleClickZoom(this.enableDoubleClickZoom);
        }
        if (changes['defaultControl']) {
            this.manager.getMap().setDefaultControl(this.enableDefaultControl);
        }

        if (changes['transitLayer']) {
            this.manager.getMap().setTransitLayer(this.enableTransitLayer);
        }

        if (changes['trafficLayer']) {
            this.manager.getMap().setTrafficLayer(this.enableTrafficLayer);
        }

        if (changes['visibleToolbar']) {
            this.enableToolbar = this.enableToolbar;
        }

        if (this.enableResetToolbar) {
            this._toolbar.value = null;
        }
    }

    ngOnDestroy() {
        this.manager.destroy();
    }

    getGeoLocation(): Observable<IPosition> {
        return new Observable((observer: Observer<IPosition>) => {
            this.manager.getMap().geolocation.getGeoLocation().subscribe((position) => {
                this.geolocationChange.next(<IPosition>position);
                observer.next(position);
            });
        });
    }
}
