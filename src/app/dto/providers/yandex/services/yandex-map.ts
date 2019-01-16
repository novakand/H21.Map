import { FetchStatus } from "../../../enum/e-fetch-status";
import { Observable, Observer } from "rxjs";
import { Injectable, NgZone } from "@angular/core";
import { YandexEventService } from "./yandex-event";
import { ReadyStateScript } from "../../../enum/e-ready-state-script";
import { YandexMarkerClusterService } from "./yandex-cluster";
import { YandexSearchService } from "./yandex-search";
import { YandexRouteBuilderService } from "./yandex-route";
import { YandexInfoBoxService } from "./yandex-info-box";
import { CallbackName } from "../../../enum/e-callback-name";
import { YandexMarkerService } from "./yandex-marker";
import { MapService } from "../../../services/abstract-map";
import { YandexCircleService } from "./yandex-circle";
import { YandexPolylineService } from "./yandex-polyline";
import { YandexPolygonService } from "./yandex-polygon";
import { YandexGeocodingService } from "./yandex-geocoding";
import { YandexGeoLocationService } from "./yandex-geolocation";
import { YandexBoundsService } from "./yandex-bounds";
import { YandexAreaService } from "./yandex-area";
import { YandexApiConfig } from "../entity/yandex.api.config";
import { YandexConversionsService } from "./yandex-conversions";
import { IMarkerOptions } from "../../../interfaces/i-marker-options";
import { CursorType } from "../../google/enum/e-cursor-type";
import { ICircleOptions } from "../../../interfaces/i-circle-options";
import { IPolygonOptions } from "../../../interfaces/i-polygon";
import { IPolylineOptions } from "../../../interfaces/i-polyline-options";
import { IMapOptions } from "../../../interfaces/i-map-options";

declare var ymaps;
declare var document;

@Injectable()
export class YandexMapService extends MapService<ymaps.Map, ymaps.GeoObject> {

    constructor(
        apiconfig: YandexApiConfig,
        events: YandexEventService,
        marker: YandexMarkerService,
        cluster: YandexMarkerClusterService,
        search: YandexSearchService,
        route: YandexRouteBuilderService,
        box: YandexInfoBoxService,
        circle: YandexCircleService,
        polyline: YandexPolylineService,
        polygon: YandexPolygonService,
        geocoding: YandexGeocodingService,
        geolocation: YandexGeoLocationService,
        bounds: YandexBoundsService,
        area: YandexAreaService,
        conversions: YandexConversionsService,
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
        this.api.cursors.push(cursor);
    }

    setTrafficLayer(enabled: boolean): void {
        const traffic = new ymaps.control.TrafficControl({ shown: enabled });
        this.api.controls.add(traffic).options.set({
            visible: false
        });
    }

    setTransitLayer(enabled: boolean): void { }

    getZoom(): number {
        return this.api.getZoom()
    }
    createCircle(circleOptions: ICircleOptions = <ICircleOptions>{}): Observable<ymaps.Circle> {

        return new Observable((observer: Observer<ymaps.Circle>) => {

            const position = [[circleOptions.center.latitude, circleOptions.center.longitude], circleOptions.radius];
            const options = <ymaps.ICircleOptions>{
                draggable: circleOptions.draggable,
                fillColor: circleOptions.fillColor,
                visible: circleOptions.visible,
                fillOpacity: circleOptions.fillOpacity,
                strokeColor: circleOptions.strokeColor,
                strokeOpacity: circleOptions.strokeOpacity,
                strokeWidth: circleOptions.strokeWeight,
                zIndex: circleOptions.zIndex,

            }

            observer.next(new ymaps.Circle(position, {}, options));

        });
    }

    createMarker(markerOptions: IMarkerOptions = <IMarkerOptions>{}): Observable<any> {

        return new Observable((observer: Observer<ymaps.GeoObject>) => {

            const geo = {
                geometry: {
                    type: "Point",
                    coordinates: [markerOptions.position.latitude, markerOptions.position.longitude]
                },
                properties: {
                    hintContent: markerOptions.title
                },
            }

            const options = {
                iconLayout: 'default#image',
                iconImageSize: [markerOptions.icon.height, markerOptions.icon.width],
                iconImageHref: markerOptions.icon.url,
                draggable: markerOptions.draggable,
            }
            observer.next(new ymaps.GeoObject(geo, options))

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
        this.api.options.set('minZoom', [zoom]);
    }

    setMaxZoom(zoom: number): void {
        this.api.options.set('maxZoom', [zoom]);
    }

    setDraggable(enabled: any) {
        enabled ? this.api.behaviors.get('drag').disable() : this.api.behaviors.get('drag').enable();
    }
    setScrollwheel(enabled: boolean): void {
        enabled ? this.api.behaviors.get('scrollZoom').disable() : this.api.behaviors.get('scrollZoom').enable();
    }

    setDoubleClickZoom(enabled: boolean): void {
        enabled ? this.api.behaviors.get('dblClickZoom').disable() : this.api.behaviors.get('dblClickZoom').enable();
    }

    setClick(enabled: boolean): void {
        this.clickMap = enabled;
    }

    setCenter(latitude: number, longitude: number): void {
        this.api.setCenter([latitude, longitude]);
    }

    setDefaultControl(enabled: boolean): void {
        throw new Error("Method not implemented.");
    }

    createMap(htmlElement: HTMLElement, mapOptions: IMapOptions = <IMapOptions>{}): Observable<void> {

        const options = <ymaps.IMapState>{
            center: [mapOptions.center.latitude, mapOptions.center.longitude],
            behaviors: ['default', 'scrollZoom'],
            zoom: mapOptions.zoom,
            controls: mapOptions.enableDefaultControl ? ['zoomControl'] : [],
        }
        this.api = new ymaps.Map(htmlElement, options);

        this.api.options.set('minZoom', [mapOptions.minZoom]);
        this.api.options.set('maxZoom', [mapOptions.maxZoom]);

        let cursor = mapOptions.defaultCursor;

        if (mapOptions.defaultCursor == CursorType.default) {
            cursor = 'inherit'
        }

        this.api.cursors.push(cursor);
        mapOptions.enableDoubleClickZoom ? this.api.behaviors.get('dblClickZoom').enable() : this.api.behaviors.get('dblClickZoom').disable();
        mapOptions.enableScrollwheel ? this.api.behaviors.get('scrollZoom').enable() : this.api.behaviors.get('scrollZoom').disable();
        this._zone.run(()=>this.loadMap.next(true));
        return
    }


    public get scriptSelector(): string {
        return "script[src*='api-maps']";
    };

    public get styleSelector(): string {
        return ".style[data-ymaps]";
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
                    window['APILoaded'] = () => {
                        this.callbackMap.emit(CallbackName.loadApiMap, FetchStatus.SUCCESS);
                        observer.next(true);
                    }
                }
                apiScript.onerror = () => {
                    observer.next(false);
                    this.loadMap.next(false);
                };
                headElement.appendChild(apiScript);

            });
        } catch (error) {

        }
    }
    destroy(): void {
        super.destroy();
        ymaps = null;
        this.api.destroy();
    }

}
