import { Injectable } from "@angular/core";
import { MapService } from "../../../services/abstract-map";
import { FetchStatus } from "../../../enum/e-fetch-status";
import { Observable, Observer } from "rxjs";
import { GoogleEventService } from "./google-event";
import { ReadyStateScript } from "../../../enum/e-ready-state-script";
import { GoogleMarkerClusterService } from "./google-cluster";
import { GoogleSearchService } from "./google-search";
import { GoogleRouteBuilderService } from "./google-route";
import { CallbackName } from "../../../enum/e-callback-name";
import { GoogleInfoBoxService } from "./google-info-box";
import { GoogleMarkerService } from "./google-marker";
import { GooglePolylineService } from "./google-polyline";
import { GooglePolygonService } from "./google-polygon";
import { GoogleGeocodingService } from "./google-geocoding";
import { GoogleGeoLocationService } from "./google-geolocation";
import { GoogleCircleService } from "./google-circle";
import { GoogleBoundsService } from "./google-bounds";
import { GoogleAreaService } from "./google-area";
import { IMapOptions } from "../../../interfaces/i-map-options";
import { GoogleApiConfig } from "../entity/google-api-config";
import { CursorType } from "../enum/e-cursor-type";
import { ICircleOptions } from "../../../interfaces/i-circle-options";
import { IPolygonOptions } from "../../../interfaces/i-polygon";
import { IPolylineOptions } from "../../../interfaces/i-polyline-options";
import { GoogleConversionsService } from "./google-conversions";
import { IMarkerOptions } from "../../../interfaces/i-marker-options";
import { GoogleStyleMap } from "../entity/google-map-style";

declare var google: any;
declare var document;

@Injectable()
export class GoogleMapService extends MapService<google.maps.Map, google.maps.Marker> {

  constructor(

    apiconfig: GoogleApiConfig,
    events: GoogleEventService,
    marker: GoogleMarkerService,
    cluster: GoogleMarkerClusterService,
    search: GoogleSearchService,
    route: GoogleRouteBuilderService,
    infoBox: GoogleInfoBoxService,
    circle: GoogleCircleService,
    polyline: GooglePolylineService,
    polygon: GooglePolygonService,
    geocoding: GoogleGeocodingService,
    geoLocation: GoogleGeoLocationService,
    bounds: GoogleBoundsService,
    area: GoogleAreaService,
    conversions: GoogleConversionsService
  ) {
    super(
      apiconfig,
      events,
      marker,
      cluster,
      search,
      route,
      infoBox,
      circle,
      polyline,
      polygon,
      geocoding,
      geoLocation,
      bounds,
      area,
      conversions
    );
  }

  public get scriptSelector(): string {
    return "script[src*='maps.googleapis.com']";
  };

  public get styleSelector(): string {
    return ".gm-style";
  }

  createCircle(circleOptions: ICircleOptions = <ICircleOptions>{}): Observable<google.maps.Circle> {

    return new Observable((observer: Observer<google.maps.Circle>) => {
      const options = <google.maps.CircleOptions>{
        center: new google.maps.LatLng(circleOptions.center.latitude, circleOptions.center.longitude),
        visible: circleOptions.visible,
        fillColor: circleOptions.fillColor,
        fillOpacity: circleOptions.fillOpacity,
        draggable: circleOptions.draggable,
        editable: circleOptions.editable,
        strokeOpacity: circleOptions.strokeOpacity,
        radius: circleOptions.radius,
        strokeColor: circleOptions.strokeColor,
        strokeWeight: circleOptions.strokeWeight
      }

      observer.next(new google.maps.Circle(options));

    });

  }
  createMarker(markerOptions: IMarkerOptions = <IMarkerOptions>{}): Observable<google.maps.Marker> {

    return new Observable((observer: Observer<google.maps.Marker>) => {
      const options = <google.maps.MarkerOptions>{
        position: new google.maps.LatLng(markerOptions.position.latitude, markerOptions.position.longitude),
        label: markerOptions.label,
        title: markerOptions.title,
        icon: markerOptions.icon.url,
        optimized: true,
        opacity: markerOptions.opacity,
        draggable: markerOptions.draggable
      }

      observer.next(new google.maps.Marker(options));

    });

  }
  createPolygon(polygonOptions: IPolygonOptions): Observable<void> {
    throw new Error("Method not implemented.");
  }

  createPolyline(polylineOptions: IPolylineOptions): Observable<void> {
    throw new Error("Method not implemented.");
  }

  createRestangle(restangleOptions: IPolylineOptions): Observable<void> {
    throw new Error("Method not implemented.");
  }

  createMap(htmlElement: HTMLElement, mapOptions: IMapOptions = <IMapOptions>{}): Observable<void> {
    try {
      const options = <google.maps.MapOptions>{
        center: new google.maps.LatLng(mapOptions.center.latitude, mapOptions.center.longitude),
        zoom: mapOptions.zoom,
        minZoom: mapOptions.minZoom,
        maxZoom: mapOptions.maxZoom,
        scrollwheel: mapOptions.enableScrollwheel,
        disableDefaultUI: !mapOptions.enableDefaultControl,
        disableDoubleClickZoom: !mapOptions.enableDoubleClickZoom,
        draggableCursor: mapOptions.defaultCursor,
        draggable: mapOptions.enableDraggable,
        styles: new GoogleStyleMap().style

      }

      this.api = new google.maps.Map(htmlElement, options);
      this.loadMap.next(true);
      return;
    } catch (error) {
      this.loadMap.next(false);
    }
  }

  loadAPI(): Observable<boolean> {
    try {
      return new Observable((observer: Observer<boolean>) => {

        const apiScript = document.createElement('script');
        const headElement = document.getElementsByTagName('head')[0];
        let apiUrl: string;
        apiScript.type = 'text/javascript';
        apiScript.async = true;
        apiScript.defer = true;
        apiUrl = `${this.apiConfig.url}&key=${this.apiConfig.key}&language=${this.apiConfig.language}`;
        apiScript.src = apiUrl;
        apiScript.id = 'mapAPI';

        if (apiScript.readyState) {
          apiScript.onreadystatechange = () => {
            if (apiScript.readyState === ReadyStateScript.loaded || apiScript.readyState === ReadyStateScript.complete) {
              apiScript.onreadystatechange = null;
            }
          };
        } else {
          window['APILoaded'] = () => {
            observer.next(true);
          }
        }
        apiScript.onerror = () => {
          this.loadMap.next(false);
          observer.next(false);
        };

        headElement.appendChild(apiScript);

      });
    } catch (error) {
      this.loadMap.next(false);
    }
  }

  setZoom(zoom: number): void {
    this.api.setZoom(zoom);
  }

  setMinZoom(zoom: number): void {
    this.api.setOptions({ minZoom: zoom });
  }

  setMaxZoom(zoom: number): void {
    this.api.setOptions({ maxZoom: zoom });
  }

  setCenter(latitude: number, longitude: number): void {
    this.api.setCenter(new google.maps.LatLng(latitude, longitude));
  }

  setDraggable(enabled: any) {
    this.api.setOptions({
      draggable: enabled,
    });
  }

  setScrollwheel(enabled: boolean): void {
    this.api.setOptions({
      scrollwheel: enabled,
    });

  }

  setDoubleClickZoom(enabled: boolean): void {
    this.api.setOptions({
      disableDoubleClickZoom: !enabled,
    });
  }

  setClick(enabled: boolean): void {
    this.clickMap = enabled;
  }

  setDefaultCursor(cursor: CursorType) {
    this.api.setOptions({ draggingCursor: cursor });
  }

  setDefaultControl(enabled: boolean): void {

    this.api.setOptions({ disableDefaultUI: enabled });
  }

  setTrafficLayer(enabled: boolean): void {

    if (!this.trafficLayer) {
      this.trafficLayer = new google.maps.TrafficLayer();
    }

    this.trafficLayer.setMap(enabled ? this.api : null);
  }


  setTransitLayer(enabled: boolean): void {

    if (!this.transitLayer) {
      this.transitLayer = new google.maps.TransitLayer();
    }
    this.transitLayer.setMap(enabled ? this.api : null);

  }

  getZoom(): number {
    return this.api.getZoom();
  }

  destroy(): void {
    super.destroy();
    google = null;
  }
}
