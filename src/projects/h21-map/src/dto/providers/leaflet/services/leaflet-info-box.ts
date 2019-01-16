import { Injectable, NgZone } from "@angular/core";
import { InfoBoxService } from "../../../services/abstract-info-box";
import { Observable, Observer } from "rxjs";
import { H21MapInfoBoxComponent } from "projects/h21-map/src/components/h21-map-info-box.component";

@Injectable()
export class LeafletInfoBoxService extends InfoBoxService<L.Map,L.Marker> {

    infoBox: L.Popup;
    IsOpen: boolean;

    constructor(private _zone: NgZone) {
        super();
    }

    initInfoBox(infobox: H21MapInfoBoxComponent): void {
        
        const options = <L.PopupOptions>{
            closeButton: false,
            className: '',
            offset: [0, -30]
        }
        this.infoBox = L.popup(options);

    }
    open(infobox: H21MapInfoBoxComponent): void {
        this.close();
        this.infoBox.setLatLng(L.latLng(infobox.latitude, infobox.longitude));
        this.infoBox.setContent(infobox.content.nativeElement);
        this.infoBox.openOn(this.map.api);
        this.isOpen = true;

    }
    close(): void {
        if (this.infoBox) {
            this.isOpen = false;
            this.map.api.closePopup();
        }

    }
    createEvent<A>(eventName: string, marker: any): Observable<A> {
        return Observable.create((observer: Observer<any>) => {
            this.infoBox.addEventListener(eventName, (event) => this._zone.run(() => observer.next(event)))
        });

    }

}
