import { Observable, Observer } from "rxjs";
import { Injectable, NgZone } from "@angular/core";
import { MapService } from "../../../services/abstract-map";
import { FetchStatus } from "../../../enum/e-fetch-status";
import { ReadyStateScript } from "../../../enum/e-ready-state-script";
import { LeafletEventService } from "./leaflet-event";
import { LeafletMarkerClusterService } from "./leaflet-cluster";
import { LeafletSearchService } from "./leaflet-search";
import { LeafletRouteBuilderService } from "./leaflet-route";
import { LeafletInfoBoxService } from "./leaflet-info-box";
import { LeafletMarkerService } from "./leaflet-marker";
import { LeafletCircleService } from "./leaflet-circle";
import { LeafletPolylineService } from "./leaflet-polyline";
import { LeafletPolygonService } from "./leaflet-polygon";
import { LeafletGeocodingService } from "./leaflet-geocoding";
import { LeafletGeoLocationService } from "./leaflet-geolocation";
import { LeafletBoundsService } from "./leaflet-bounds";
import { LeafletAreaService } from "./leaflet-area";
import { CallbackName } from "../../../enum/e-callback-name";
import { LeafletApiConfig } from "../entity/leaflet-api.config";
import { LeafletConversionsService } from "./leaflet-conversions";
import { IMarkerOptions } from "../../../interfaces/i-marker-options";
import { IMapOptions } from "../../../interfaces/i-map-options";
import { IPolygonOptions } from "../../../interfaces/i-polygon";
import { IPolylineOptions } from "../../../interfaces/i-polyline-options";
import { CursorType } from "../../google/enum/e-cursor-type";
import { ICircleOptions } from "../../../interfaces/i-circle-options";

declare var L;
declare var document;

@Injectable()
export class LeafletMapService extends MapService<L.Map, L.Marker> {

    constructor(
        apiconfig: LeafletApiConfig,
        events: LeafletEventService,
        marker: LeafletMarkerService,
        cluster: LeafletMarkerClusterService,
        search: LeafletSearchService,
        route: LeafletRouteBuilderService,
        infoBox: LeafletInfoBoxService,
        circle: LeafletCircleService,
        polyline: LeafletPolylineService,
        polygon: LeafletPolygonService,
        geocoding: LeafletGeocodingService,
        geolocation: LeafletGeoLocationService,
        bounds: LeafletBoundsService,
        area: LeafletAreaService,
        conversions: LeafletConversionsService,
        private _zone: NgZone
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
            geolocation,
            bounds,
            area,
            conversions
        );
    }

    setDefaultCursor(cursor: CursorType) {
        this.api.getContainer().style.cursor = cursor;
    }

    setTrafficLayer(enabled: boolean): void {

    }

    setTransitLayer(enabled: boolean): void {

    }

    getZoom(): number {
        return this.api.getZoom();
    }

    createCircle(circleOptions: ICircleOptions = <ICircleOptions>{}): Observable<L.Circle> {

        return new Observable((observer: Observer<L.Circle>) => {

            const options = <L.CircleMarkerOptions>{
                visible: circleOptions.visible,
                color: circleOptions.fillColor,
                fillOpacity: circleOptions.fillOpacity,
                draggable: circleOptions.draggable,
                strokeOpacity: circleOptions.strokeOpacity,
                radius: circleOptions.radius,
                strokeColor: circleOptions.strokeColor,
                strokeWeight: circleOptions.strokeWeight
            }
            observer.next(new L.circle([circleOptions.center.latitude, circleOptions.center.longitude], options));
        });
    }

    createMarker(markerOptions: IMarkerOptions = <IMarkerOptions>{}): Observable<any> {

        return new Observable((observer: Observer<L.Marker>) => {

            const icon = L.icon({
                iconUrl: markerOptions.icon.url,
                iconSize: [markerOptions.icon.height, markerOptions.icon.width],
            });

            const options = <L.MarkerOptions>{
                icon: icon,
                title: markerOptions.title,
                enableDragging: markerOptions.draggable,
                enableClicking: markerOptions.clickable,
                draggingCursor: markerOptions.cursor,

            }
            observer.next(new L.marker([markerOptions.position.latitude, markerOptions.position.longitude], options));
        });
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

    setDraggable(enabled: any) {
        enabled ? this.api.dragging.disable() : this.api.dragging.enable();
    }

    setScrollwheel(enabled: boolean): void {
        enabled ? this.api.scrollWheelZoom.disable() : this.api.scrollWheelZoom.enabled();
    }

    setDoubleClickZoom(enabled: boolean): void {
        enabled ? this.api.doubleClickZoom.enabled() : this.api.doubleClickZoom.disable();
    }

    setClick(enabled: boolean): void {
        this.clickMap = enabled;
    }

    setCenter(latitude: number, longitude: number): void {

        this.api.setView([latitude, longitude], null);
    }

    setDefaultControl(enabled: boolean): void {
        throw new Error("Method not implemented.");
    }

    createMap(elementHTML: HTMLElement, mapOptions: IMapOptions): Observable<void> {
        try {
            const options = <L.MapOptions>{
                zoom: mapOptions.zoom,
                minZoom: mapOptions.minZoom,
                maxZoom: mapOptions.maxZoom,
                animate: true,
                editable: true,
                duration: 0.5,
                easeLinearity: 100,
                zoomAnimation: true,
                zoomControl: mapOptions.enableDefaultControl,
                doubleClickZoom: mapOptions.enableDoubleClickZoom,
                attributionControl: false,
                dragging: mapOptions.enableDraggable,
                scrollWheelZoom: mapOptions.enableScrollwheel,
                center: [mapOptions.center.latitude, mapOptions.center.longitude]
            }

            this.api = new L.map(elementHTML, options);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

            }).addTo(this.api);
            this.api.getContainer().style.cursor = mapOptions.defaultCursor;

            this._zone.run(() => this.loadMap.next(true));
            return;
        } catch (error) {
            this._zone.run(() => this.loadMap.next(false));
        }
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

    public get scriptSelector(): string {
        return "";
    };

    public get styleSelector(): string {
        return "";
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
                apiUrl = this.apiConfig.url;
                apiScript.src = apiUrl;
                apiScript.id = 'mapAPI';

                if (apiScript.readyState) {
                    apiScript.onreadystatechange = () => {
                        if (apiScript.readyState === ReadyStateScript.loaded || apiScript.readyState === ReadyStateScript.complete) {
                            apiScript.onreadystatechange = null;
                        }
                    };
                } else {
                    window.onload = () => {
                        setTimeout(() => {
                            observer.next(true);
                        }, 500);
                        if (L) {
                            this.loadPlugin()
                        }
                    }
                }
                apiScript.onerror = () => {
                };

                headElement.appendChild(apiScript);

            });
        } catch (error) {
        }
    }

    private loadPlugin() {
        import('@h21-map/leaflet-edit-table');
        import('@h21-map/leaflet-geodesic');
        import('@h21-map/leaflet-path-drag');
        import('@h21-map/leaflet-markercluster');

    }

    destroy(): void {
        super.destroy();
        this.api.remove();
        L = null;
    }

}
