import { Directive, OnChanges, OnDestroy, SimpleChange, Input, Output,  AfterViewInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { MapManager } from '../dto/manager/map-manager';
import { EventType } from '../dto/enum/e-event-type';

let circleId = 0;

@Directive({
    selector: 'h21-map-circle',

})

export class H21MapCircleDirective implements OnChanges, OnDestroy, AfterViewInit {

    constructor(private manager: MapManager) { this._id = (circleId++).toString(); }

    @Input() latitude: number = 0;

    @Input() longitude: number = 0;

    @Input('circleClickable') enableClickable: boolean = true;

    @Input('circleDraggable') enableDraggable: boolean = false;

    @Input('circleEditable') enableEditable: boolean = false;

    @Input() fitBounds: boolean = true;

    @Input() fillColor: string = "#0044d6";

    @Input() fillOpacity: number = 0.08;

    @Input() radius: number = 0;

    @Input() strokeColor: string = "#0044d6";

    @Input() strokeOpacity: number = 0.7;

    @Input() strokeWeight: number = 3.5;

    @Input('circleVisible') enableVisible: boolean = true;

    @Input() zIndex: number;

    @Output() circleClick: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() circleDblClick: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() circleMouseDown: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() circleMouseMove: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() circleMouseOut: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() circleMouseOver: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() circleMouseUp: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() circleRadiusChange: Subject<number> = new Subject<number>();

    @Output() circleCenterChange: Subject<number> = new Subject<number>();


    private _circleAddService: boolean = false;

    private _id: string;

    private _observableSubscriptions: Subscription[] = [];

    ngAfterViewInit() {

        if (!this.manager.getMap().circle) { return; }
        if (!this._circleAddService) {
            this.manager.getMap().circle.addCicrle(this);
            this.addEventListeners();
            this._circleAddService = true;

        }
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {

        if (!this.manager.getMap().circle) { return; }
        if (!this._circleAddService) { return; }

        if (changes['latitude'] || changes['longitude']) {
            this.manager.getMap().circle.setCenter(this);
            this.circleCenterChange.next(this.manager.getMap().circle.getRadius(this));
        }
        if (changes['enableEditable']) {
            this.manager.getMap().circle.setEditable(this);
        }
        if (changes['enableDraggable']) {
            this.manager.getMap().circle.setDraggable(this);
        }
        if (changes['enableVisible']) {
            this.manager.getMap().circle.setVisible(this);
        }
        if (changes['radius']) {
            this.manager.getMap().circle.setRadius(this);
            this.circleRadiusChange.next(this.manager.getMap().circle.getRadius(this));
        }
        if (changes['strokeColor']) {
            this.manager.getMap().circle.setStrokeColor(this);
        }
        if (changes['strokeOpacity']) {
            this.manager.getMap().circle.setStrokeOpacity(this);
        }
        if (changes['fillColor']) {
            this.manager.getMap().circle.setFillColor(this);
        }
        if (changes['fillOpacity']) {
            this.manager.getMap().circle.setFillOpacity(this);
        }
    }

    ngOnDestroy(): void {

        this.manager.getMap().circle.removeCircle(this);
        this._observableSubscriptions.forEach((s) => s.unsubscribe());
    }


    addEventListeners() {
        const eventClick = this.manager.getMap().circle.createEvent(EventType.click, this).subscribe(event => {
            this.circleClick.next(<MouseEvent>event);
        });

        this._observableSubscriptions.push(eventClick);

        const eventDbClick = this.manager.getMap().circle.createEvent(EventType.dblClick, this).subscribe(event => {
            this.circleClick.next(<MouseEvent>event);
        });

        this._observableSubscriptions.push(eventDbClick);

        const eventMouseOver = this.manager.getMap().circle.createEvent(EventType.mouseOver, this).subscribe(event => {
            this.circleMouseOver.next(<MouseEvent>event);
        });

        this._observableSubscriptions.push(eventMouseOver);

        const eventMouseDown = this.manager.getMap().circle.createEvent(EventType.mouseDown, this).subscribe(event => {
            this.circleMouseDown.next(<MouseEvent>event);
        });

        this._observableSubscriptions.push(eventMouseDown);

        const eventMouseOut = this.manager.getMap().circle.createEvent(EventType.mouseOut, this).subscribe(event => {
            this.circleMouseOut.next(<MouseEvent>event);
        });

        this._observableSubscriptions.push(eventMouseOut);

        const eventMouseUp = this.manager.getMap().circle.createEvent(EventType.mouseUp, this).subscribe(event => {
            this.circleMouseUp.next(<MouseEvent>event);
        });

        this._observableSubscriptions.push(eventMouseUp);

    }
}