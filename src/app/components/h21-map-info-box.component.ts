import { OnChanges, OnDestroy, Input, SimpleChanges, Component, ViewChild, ElementRef } from "@angular/core";
import { MapManager } from "../dto/manager/map-manager";
import { Subscription } from "rxjs";

@Component({
    selector: 'h21-map-info-box',
    template: `
    <div #infoBoxContent>
    <div class="c-h21-map-info-box">
    <div class="tooltip">
    <ng-content></ng-content>
        <div class="tooltip__arrow"></div>
    </div>
  </div> 
  </div>
  `
})


export class H21MapInfoBoxComponent implements OnChanges {

    constructor(private manager: MapManager) { }

    @Input() latitude: number;

    @Input() longitude: number;

    @Input() isOpen: boolean = false;

    @Input() zIndex: number = 9999;

    @Input() closeBoxURL: string = " ";

    @ViewChild('infoBoxContent') content: ElementRef;

    private _infoBoxAddService = false;
    private _observableSubscriptions: Subscription[] = [];

    ngOnInit() {
        const initMap = this.manager.getMap().loadMap.subscribe(status => {
             if (status) {
                 this.initService();
             }
         });
         this._observableSubscriptions.push(initMap);
     }
 
     initService() {
        if (!this.manager.getMap().infoBox) { return; }
            if (!this._infoBoxAddService) {
                this.manager.getMap().infoBox.initInfoBox(this);
                this._infoBoxAddService = true;
            }
         this._observableSubscriptions[0].unsubscribe();
     }

    ngOnChanges(changes: SimpleChanges) {

        if (!this._infoBoxAddService) { return; }
        if (!this.manager.getMap().infoBox) { return; }

        if ('isOpen' in changes && this.isOpen) {
            this.manager.getMap().infoBox.open(this);
        } else if ('isOpen' in changes && !this.isOpen) {
            this.manager.getMap().infoBox.close();
        }
    }
}