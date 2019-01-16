import { Injectable } from "@angular/core";
import { MapService } from "./abstract-map";
import { H21MapInfoBoxComponent } from "../../components/h21-map-info-box.component";
import { Observable } from "rxjs";

@Injectable()
export abstract class InfoBoxService<T, U> {

  map: MapService<T, U>;
  isOpen: boolean;
  infoBox: any;

  initMap(map: MapService<T, U>): void {
    this.map = map;
  }

  abstract initInfoBox(infobox: H21MapInfoBoxComponent): void;

  abstract open(infobox: H21MapInfoBoxComponent): void;

  abstract close(): void;

  abstract createEvent<A>(eventName: string, infobox: H21MapInfoBoxComponent): Observable<A>;

}
