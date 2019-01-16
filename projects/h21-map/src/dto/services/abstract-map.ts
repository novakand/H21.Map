import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IMapOptions } from '../interfaces/i-map-options';
import { FetchStatus } from '../enum/e-fetch-status';
import { IApiConfig } from '../interfaces/i-api-settings';
import { EventService } from './abstract-event';
import { MarkerClusterService } from './abstract-cluster';
import { SearchService } from './abstract-search';
import { RouteBuilderService } from './abstract-route';
import { EventEmitter } from 'events';
import { InfoBoxService } from './abstract-info-box';
import { MarkerService } from './abstract-marker';
import { CircleService } from './abstract-circle';
import { PolylineService } from './abstract-polyline';
import { PolygonService } from './abstract-polygon';
import { GeoCodingService } from './abstract-geocoding';
import { GeolocationService } from './abstract-geolocation';
import { BoundsService } from './abstract-bounds';
import { AreaService } from './abstract-area';
import { CursorType } from '../providers/google/enum/e-cursor-type';
import { ICircleOptions } from '../interfaces/i-circle-options';
import { IPolylineOptions } from '../interfaces/i-polyline-options';
import { IPolygonOptions } from '../interfaces/i-polygon';
import { ConversionsService } from './abstract-conversions';
import { IMarkerOptions } from '../interfaces/i-marker-options';

@Injectable()
export abstract class MapService<T, U> {

  api: T;
  loadMarkers: boolean = false;
  clickMap: boolean = true;
  transitLayer: any;
  trafficLayer: any;
  callbackMap: EventEmitter = new EventEmitter();
  loadMap: Subject<boolean> = new Subject<boolean>();

  constructor(
    public apiConfig: IApiConfig,
    public events: EventService<T, U>,
    public marker: MarkerService<T, U>,
    public cluster: MarkerClusterService<T, U>,
    public search: SearchService<T, U>,
    public route: RouteBuilderService<T, U>,
    public infoBox: InfoBoxService<T, U>,
    public circle: CircleService<T, U>,
    public polyline: PolylineService<T, U>,
    public polygon: PolygonService<T, U>,
    public geocoding: GeoCodingService<T, U>,
    public geolocation: GeolocationService<T, U>,
    public bounds: BoundsService<T, U>,
    public area: AreaService<T, U>,
    public conversions: ConversionsService<T, U>
  ) {

    this.events.initMap(this);
    this.cluster.initMap(this);
    this.marker.initMap(this);
    this.route.initMap(this);
    this.search.initMap(this);
    this.infoBox.initMap(this);
    this.geolocation.initMap(this);
    this.geocoding.initMap(this);
    this.circle.initMap(this);
    this.polygon.initMap(this);
    this.polyline.initMap(this);
    this.bounds.initMap(this);
    this.area.initMap(this);
    this.conversions.initMap(this);
  }

  public get container(): HTMLElement {
    return document.getElementById('map');
  };

  abstract get styleSelector(): string;

  abstract get scriptSelector(): string;

  abstract createMap(container: HTMLElement, mapOptions: IMapOptions): Observable<void>;

  abstract createCircle(circleOptions: ICircleOptions): Observable<any>;

  abstract createMarker(circleOptions: IMarkerOptions): Observable<any>;

  abstract createPolygon(polygonOptions: IPolygonOptions): Observable<void>;

  abstract createPolyline(polylineOptions: IPolylineOptions): Observable<void>;

  abstract createRestangle(restangleOptions: IPolylineOptions): Observable<void>;

  abstract loadAPI(): Observable<boolean>;

  abstract setZoom(zoom: number): void;

  abstract setMinZoom(zoom: number): void;

  abstract setMaxZoom(zoom: number): void;

  abstract setDraggable(enabled: boolean): void;

  abstract setScrollwheel(enabled: boolean): void;

  abstract setDoubleClickZoom(enabled: boolean): void;

  abstract setClick(enabled: boolean): void;

  abstract setCenter(latitude: number, longitude: number): void;

  abstract setDefaultCursor(cursor: CursorType): void;

  abstract setTrafficLayer(enabled: boolean): void;

  abstract setTransitLayer(enabled: boolean): void;

  abstract setDefaultControl(enabled: boolean): void;

  abstract getZoom(): number;

  public destroy(): void {

    this.removeCurrentMapScriptContainer();
    this.clearCurrentMapStyles();
    this.clearCurrentMapScripts();
    this.container.innerHTML = "";

  }

  private removeCurrentMapScriptContainer(): void {

    let apiScript = document.getElementById('mapAPI');
    if (apiScript) {
      apiScript.remove();
    }
  }

  private clearCurrentMapStyles(): void {

    Array.from(document.querySelectorAll('style'))
      .forEach(style => {
        let isMapStyle = style.innerHTML.indexOf(this.styleSelector) > -1;
        if (isMapStyle) {
          style.remove();
        }
      });
  }

  private clearCurrentMapScripts(): void {
    Array.from(document.querySelectorAll(this.scriptSelector))
      .forEach(script => {
        script.remove();
      });
  }
}
