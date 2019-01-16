import { Injectable, NgZone } from "@angular/core";
import { InfoBoxService } from "../../../services/abstract-info-box";
import { Observable, Observer } from "rxjs";
import { H21MapInfoBoxComponent } from "projects/h21-map/src/components/h21-map-info-box.component";
import { InfoBox } from '@h21-map/baidu-infobox'

@Injectable()
export class BaiduInfoBoxService extends InfoBoxService<BMap.Map, BMap.Marker> {

    infoBox: any;

    constructor(private _zone: NgZone) {
        super();
    }

    initInfoBox(infobox: H21MapInfoBoxComponent): void {
        try {
            const option = {
                boxStyle: {
                    width: "inherit",
                    height: "inherit",
                },
                closeIconUrl: infobox.closeBoxURL,
                alignBottom: false,
                offset: new BMap.Size(-150, 105),
                enableAutoPan: true,
            }

            this.infoBox = new InfoBox(this.map.api, " ", option);
        } catch (error) { }
    }

    open(infobox: H21MapInfoBoxComponent): void {
        this.close();
        this.infoBox.open(new BMap.Point(infobox.longitude, infobox.latitude));
        this.infoBox.setContent(infobox.content.nativeElement);
        this.isOpen = true;
    }

    close(): void {
        if (this.infoBox) {
            this.isOpen = false;
            this.infoBox.close();
        }
    }

    createEvent<A>(eventName: string, infobox: any): Observable<A> {
        return Observable.create((observer: Observer<A>) => {
            this.infoBox.addEventListener(eventName, (event: A) => this._zone.run(() => observer.next(event)))
        });
    }
}
