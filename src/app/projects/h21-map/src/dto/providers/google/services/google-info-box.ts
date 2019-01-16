import { Injectable, NgZone } from "@angular/core";
import { InfoBoxService } from "../../../services/abstract-info-box";
import { InfoBox } from '@h21-map/google-infobox'
import { H21MapInfoBoxComponent } from "projects/h21-map/src/components/h21-map-info-box.component";
import { Observer, Observable } from "rxjs";

declare var google;

@Injectable()
export class GoogleInfoBoxService extends InfoBoxService<google.maps.Map, google.maps.Marker> {

    infoBox: InfoBox;
    IsOpen: boolean;

    constructor(private _zone: NgZone) {
        super();
    }

    initInfoBox(infobox: H21MapInfoBoxComponent): void {
        const options = {
            zIndex: infobox.zIndex,
            alignBottom: true,
            closeBoxURL: infobox.closeBoxURL,
            enableEventPropagation: false,
            pixelOffset: new google.maps.Size(-180, -42),
            pane: "floatPane",
            infoBoxClearance: new google.maps.Size(1, 1),
        }

        this.infoBox = new InfoBox(options);
        this.isOpen = false;

    }
    open(infobox: H21MapInfoBoxComponent): void {
        this.close();
        this.infoBox.setPosition(new google.maps.LatLng(infobox.latitude, infobox.longitude))
        this.infoBox.setContent(infobox.content.nativeElement);
        this.infoBox.open(this.map.api);
        this.isOpen = true;
    }

    close(): void {
        if (this.infoBox) {
            this.isOpen = false;
            this.infoBox.close();
        }
    }

    createEvent<A>(eventName: string, infobox: H21MapInfoBoxComponent): Observable<A> {
        return Observable.create((observer: Observer<A>) => {
            this.infoBox.addListener(eventName, (event: A) => this._zone.run(() => observer.next(event)))
        });
    }

}
