import { Injectable, NgZone } from "@angular/core";
import { InfoBoxService } from "../../../services/abstract-info-box";
import { H21MapInfoBoxComponent } from "projects/h21-map/src/components/h21-map-info-box.component";
import { Observable, Observer } from "rxjs";

declare var ymaps: any

@Injectable()
export class YandexInfoBoxService extends InfoBoxService<ymaps.Map, ymaps.GeoObject> {

    infoBox: ymaps.Balloon;
    IsOpen: boolean;

    constructor(private _zone: NgZone) {
        super();
    }

    initInfoBox(infobox: H21MapInfoBoxComponent): void {

        const options = <ymaps.IBalloonOptions>{
            offset: [-180, -135],
            autoPanDuration: 900,
            openTimeout: 50,
            autoPan: true,
            closeButton: (infobox.closeBoxURL) ? false : true
        }

        this.infoBox = new ymaps.Balloon(this.map.api, options);
        this.infoBox.options.setParent(this.map.api.options);
    }

    open(infobox: H21MapInfoBoxComponent): void {
        this.close();
        this.isOpen = true;
        this.infoBox.open([infobox.latitude, infobox.longitude], '');
        this.infoBox.options.set({
            layout: ymaps.templateLayoutFactory.createClass(
                infobox.content.nativeElement.outerHTML
            ),
        });
    }

    close(): void {
        if (this.infoBox) {
            this.isOpen = false;
            this.infoBox.close()
        }
    }

    createEvent<A>(eventName: string, infobox: H21MapInfoBoxComponent): Observable<A> {
        return Observable.create((observer: Observer<any>) => {
            this.map.api.balloon.events.add(eventName, (event) => this._zone.run(() => observer.next(event)))
        });

    }
}
