import { MapService } from "../../../services/abstract-map";
import { FetchStatus } from "../../../enum/e-fetch-status";
import { Observable, Observer } from "rxjs";
import { Injectable, NgZone } from "@angular/core";
import { ReadyStateScript } from "../../../enum/e-ready-state-script";
import { BaiduMarkerClusterService } from "./baidu-cluster";
import { BaiduSearchService } from "./baidu-search";
import { BaiduRouteBuilder } from "./baidu-route";
import { BaiduInfoBoxService } from "./baidu-info-box";
import { BaiduMarkerService } from "./baidu-marker";
import { BaiduCircleService } from "./baidu-circle";
import { BaiduPolylineService } from "./baidu-polyline";
import { BaiduPolygonService } from "./baidu-polygon";
import { BaiduGeocodingService } from "./baidu-geocoding";
import { BaiduGeoLocationService } from "./baidu-geolocation";
import { BaiduBoundsService } from "./baidu-bounds";
import { BaiduEventService } from "./baidu-event";
import { BaiduAreaService } from "./baidu-area";
import { BaiduApiConfig } from "../entity/baidu-api-config";
import { BaiduConversionsService } from "./baidu-conversions";
import { IMarkerOptions } from "../../../interfaces/i-marker-options";
import { ICircleOptions } from "../../../interfaces/i-circle-options";
import { IMapOptions } from "../../../interfaces/i-map-options";
import { CursorType } from "../../google/enum/e-cursor-type";
import { IPolylineOptions } from "../../../interfaces/i-polyline-options";
import { BaiduStyleMap } from "../entity/baidu-map-style";
import { IPolygonOptions } from "../../../interfaces/i-polygon";


declare var BMap;
declare var document;

@Injectable()
export class BaiduMapService extends MapService<BMap.Map, BMap.Marker> {

    constructor(
        apiconfig: BaiduApiConfig,
        events: BaiduEventService,
        marker: BaiduMarkerService,
        cluster: BaiduMarkerClusterService,
        search: BaiduSearchService,
        route: BaiduRouteBuilder,
        box: BaiduInfoBoxService,
        circle: BaiduCircleService,
        polyline: BaiduPolylineService,
        polygon: BaiduPolygonService,
        geocoding: BaiduGeocodingService,
        geolocation: BaiduGeoLocationService,
        bounds: BaiduBoundsService,
        area: BaiduAreaService,
        conversions: BaiduConversionsService,
        private _zone: NgZone
    ) {
        super(
            apiconfig,
            events,
            marker,
            cluster,
            search,
            route,
            box,
            circle,
            polyline,
            polygon,
            geocoding,
            geolocation,
            bounds,
            area,
            conversions
        );
    }

    setDefaultCursor(cursor: CursorType) {
        this.api.setDefaultCursor(cursor);
    }
    setTrafficLayer(enabled: boolean): void {

    }

    setTransitLayer(enabled: boolean): void {

    }

    getZoom(): number {
        return this.api.getZoom();
    }

    createCircle(circleOptions: ICircleOptions = <ICircleOptions>{}): Observable<BMap.Circle> {
        return new Observable((observer: Observer<BMap.Circle>) => {

            const center = new BMap.Point(circleOptions.center.longitude, circleOptions.center.latitude);
            const radius = circleOptions.radius;

            const options = <BMap.CircleOptions>{
                visible: circleOptions.visible,
                fillColor: circleOptions.fillColor,
                fillOpacity: circleOptions.fillOpacity,
                enableEditing: circleOptions.editable,
                draggable: circleOptions.draggable,
                strokeOpacity: circleOptions.strokeOpacity,
                strokeColor: circleOptions.strokeColor,
                strokeWeight: circleOptions.strokeWeight
            }

            observer.next(new BMap.Circle(center, radius, options));

        });
    }
    createMarker(markerOptions: IMarkerOptions = <IMarkerOptions>{}): Observable<BMap.Marker> {

        return new Observable((observer: Observer<BMap.Marker>) => {
            const icon = markerOptions.icon.url ?
                new BMap.Icon(markerOptions.icon.url, new BMap.Size(markerOptions.icon.width, markerOptions.icon.height)) : null;

            const options = <BMap.MarkerOptions>{
                icon: icon,
                title: markerOptions.title,
                enableDragging: markerOptions.draggable,
                enableClicking: markerOptions.clickable,
                draggingCursor: markerOptions.cursor

            }

            const position = new BMap.Point(markerOptions.position.longitude, markerOptions.position.latitude);
            const marker: BMap.Marker = new BMap.Marker(position, options);
            observer.next(marker);

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

    setZoom(zoom: number): void {
        this.api.setZoom(zoom);
    }

    setMinZoom(zoom: number): void {
        this.api.setMinZoom(zoom);
    }

    setMaxZoom(zoom: number): void {
        this.api.setMaxZoom(zoom);
    }

    setDraggable(enabled: boolean) {
        enabled ? this.api.enableDragging() : this.api.disableDragging();
    }

    setScrollwheel(enabled: boolean): void {
        enabled ? this.api.enableScrollWheelZoom() : this.api.disableScrollWheelZoom();
    }

    setDoubleClickZoom(enabled: boolean): void {
        enabled ? this.api.enableDoubleClickZoom() : this.api.disableDoubleClickZoom();
    }

    setClick(enabled: boolean): void {
        this.clickMap = enabled;
    }

    setCenter(latitude: number, longitude: number): void {
        this.api.setCenter(new BMap.Point(latitude, longitude));
    }

    setDefaultControl(enabled: boolean): void {
        throw new Error("Method not implemented.");
    }

    public get scriptSelector(): string {
        return "script[src*='api.map.baidu']";
    };

    public get styleSelector(): string {
        return ".BMap_mask";
    }

    createMap(htmlElement: HTMLElement, mapOptions: IMapOptions = <IMapOptions>{}): Observable<void> {
        try {
            const options = <BMap.MapOptions>{
                minZoom: mapOptions.minZoom,
                maxZoom: mapOptions.maxZoom,
            }

            this.api = new BMap.Map(htmlElement, options);
            this.api.enableAutoResize();
            this.api.centerAndZoom(new BMap.Point(mapOptions.center.longitude, mapOptions.center.latitude), mapOptions.zoom + 1);
            this.api.setDefaultCursor(mapOptions.defaultCursor);

            this.api.addControl(new BMap.ScaleControl());

            mapOptions.enableDefaultControl ? this.api.addControl(new BMap.NavigationControl()) : null;

            mapOptions.enableDoubleClickZoom ? this.api.enableDoubleClickZoom() : this.api.disableDoubleClickZoom();
            mapOptions.enableScrollwheel ? this.api.enableScrollWheelZoom() : this.api.disableScrollWheelZoom();
            this._zone.run(() => this.loadMap.next(true));

            return;

        } catch (error) {
            this._zone.run(() => this.loadMap.next(false));
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
                        setTimeout(() => {
                            this._zone.run(() => observer.next(true));
                        },300);
                    }
                }
                apiScript.onerror = (error) => {
                    this._zone.run(() => observer.next(false));
                    this._zone.run(() => this.loadMap.next(false));
                };
                headElement.appendChild(apiScript);
            });
        } catch (error) {
        }
    }

    destroy(): void {
        super.destroy();
        if (this.api) {
            this.api.clearOverlays();
            this.api.clearHotspots();
            this.api.reset();
            BMap = null;
        }
    }
}
