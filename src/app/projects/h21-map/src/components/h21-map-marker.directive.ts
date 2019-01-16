import { Directive, OnChanges, OnDestroy, SimpleChange, Input, Output, AfterViewInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { MapManager, EventType } from '../dto';
import { CursorType } from '../dto/providers/google/enum/e-cursor-type';

let markerId = 0;

@Directive({
    selector: 'h21-map-marker'
})
export class H21MapMarkerDirective implements OnDestroy, OnChanges,AfterViewInit {

    constructor(private manager: MapManager) { this._id = (markerId++).toString(); }

    @Input() latitude: number = 0;

    @Input() longitude: number = 0;

    @Input() title: string = "";

    @Input() opacity: number = 1;

    @Input() label: string = '';

    @Input() inCluster: boolean = true;

    @Input() fitBonds: boolean = true;

    @Input('markerDraggable') enableDraggable: boolean = false;

    @Input() iconUrl: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAAGzs1ytAAAABGdBTUEAALGPC/xhBQAAAzpJREFUOBGdVV9Ik1EUP+c65+awpWELXVNpzhBEM6uH/uBDUFBiD4GQURnlQ9BDL4U9RURWFD0EBTOQoEKIKOnRHqICsyKMoHAJ2VDLgunQzW9//G73XHe/7ZsTsQvj3PM7f75z7/ndMwCxvP6KZyTl5tb7G9zr93BcBDxcWqTSUzFCEsmsUGZsGLu4NEZY3fnMzryp2PPbu8BZ4JRB4wl9XkY091baSCGUiTSBU2PdeaTUPfIUO/c7/65rKf4VejEzjN4ezwfg0ERGtRgB9aUNcG3PTYWBUVZhfiFYmVUaTIUrVzbaGRRVYFgBpMuyCMj1QeXICmzuwPHABFKZ8xEIKcPyEsMWLQJB5UBVb3E1QpVzE1wZvARJPSkOo+6WO8Up2FnlTLKutF44V0Hb5iPQXnss0wSyZt8DX7ke08ZNlgxFOE187wy6jQOSrdpfeYIj70LOyzjgS7uDn/zSHpxWcStnRvg4ejq4jQIws5sqwxKZChAdqZgB4IuEWOKVBuwOKMkraXF2K+jhgT7YuqEJiqxrYCT0TcFSJhNYYxCAkIS419hCTDgXSfa9O/rJCEDgey2GJjaOfAcU20rA5YjCxiJPpgk44mRO56SegIb1jWBhaTNy7Ebf/couXdevmtLkUIh1jIhPHcphNyBiHSnygNRKejGG1dhgmN4d0ZMgU7sJoCZNLsA5XecXVr5/DDOG18vy4ParjjGN4tUyEhPxeEwbEuQtV8bVSDo2Fth2qIrl8eTlCTb/b1IqgGLpRVAu0lGyHfReUjKXd201XN5lbtTd4Tvwdvx1plvOPQLrEMNJzEfOfdke9MoftzyB+ELc4Ae9dGKkWlpyHpr7dio1LREDjN5lGjHvKOlcYg6iyaj8zcZn4cxAJwxNDsLBp/vAZrGbA1Ia5WT02HNaBRhJROBPdAqmtRDMaNMwFf0NUYEFZ3+KOZVYLkxcMA6kJiL+yKaWq9AFh2valg8WloRI7v98L8sHw2IqVUm6yQGT1N+I1pr+CLIiVlbFEHJb2G7itMFjipJDNK49X/UHREJmtR1SHKZcpsQEqEV/GlqEtYp53yq8alWTacSID39FwH6bQ+/PHMQqluQ/Z99EBkHYrrcAAAAASUVORK5CYII=';

    @Input() width: number = 22;

    @Input() height: number = 22;

    @Input('markerVisible') enableVisible: boolean = true;

    @Input() zIndex: number = 100;

    @Input('markerClickable') enableClickable: boolean = true;

    @Input('markerCurcor') cursor: CursorType = CursorType.default;

    @Output() markerClick: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() markerDragEnd: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() markerMouseOver: Subject<MouseEvent> = new Subject<MouseEvent>();

    @Output() markerMouseOut: Subject<MouseEvent> = new Subject<MouseEvent>();

    private _id: string;
    private _markerAddService: boolean = false;
    private _observableSubscriptions: Subscription[] = [];

    ngAfterViewInit() {

        if (!this.manager.getMap().marker) { return; }
        if (!this._markerAddService) {
            this.manager.getMap().marker.addMarker(this);
            this.addEventListeners();
            this._markerAddService = true;

        }
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {

        if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
            return;
        }

        if (!this._markerAddService) { return; }

        if (changes['latitude'] || changes['longitude']) {
            this.manager.getMap().marker.setPosition(this);
        }
        if (changes['title']) {
            this.manager.getMap().marker.setTitle(this);
        }
        if (changes['label']) {
            this.manager.getMap().marker.setLabel(this);
        }
        if (changes['enableDraggable']) {
            this.manager.getMap().marker.setDraggable(this);
        }
        if (changes['iconUrl'] || changes['width'] || changes['height']) {
            this.manager.getMap().marker.setIcon(this);
        }
        if (changes['enableVisible']) {
            this.manager.getMap().marker.setVisible(this);
        }
        if (changes['zIndex']) {
            this.manager.getMap().marker.setZIndex(this);
        }

        if (changes['enableClickable']) {
            this.manager.getMap().marker.setClickable(this);
        }

        if (changes['opacity']) {
            this.manager.getMap().marker.setOpacity(this);
        }
    }


    ngOnDestroy() {
        this.manager.getMap().marker.removeMarker(this);
        this._observableSubscriptions.forEach((s) => s.unsubscribe());
    }


    private addEventListeners() {

        const eventClick = this.manager.getMap().marker.createEvent(EventType.click, this).subscribe(event => {
            this.markerClick.next(<MouseEvent>event);
        });

        this._observableSubscriptions.push(eventClick);

        const eventMouseOver = this.manager.getMap().marker.createEvent(EventType.mouseOver, this).subscribe(event => {
            this.markerMouseOver.next(<MouseEvent>event);

        });

        this._observableSubscriptions.push(eventMouseOver);

        const eventMouseOut = this.manager.getMap().marker.createEvent(EventType.mouseOut, this).subscribe(event => {
            this.markerMouseOut.next(<MouseEvent>event);

        });

        this._observableSubscriptions.push(eventMouseOut);

        const eventMouseEnter = this.manager.getMap().marker.createEvent(EventType.mouseEnter, this).subscribe(event => {
            this.markerMouseOver.next(<MouseEvent>event);

        });
        this._observableSubscriptions.push(eventMouseEnter);

        const eventMouseLeave = this.manager.getMap().marker.createEvent(EventType.mouseLeave, this).subscribe(event => {
            this.markerMouseOut.next(<MouseEvent>event);

        });

        this._observableSubscriptions.push(eventMouseLeave);

        const evenDragEnd = this.manager.getMap().marker.createEvent(EventType.dragEnd, this).subscribe(event => {
            this.markerDragEnd.next(<MouseEvent>event);
            this.manager.getMap().infoBox.close();
        });

        this._observableSubscriptions.push(evenDragEnd);
    }
}