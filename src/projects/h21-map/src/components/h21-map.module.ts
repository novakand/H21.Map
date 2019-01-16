import { NgModule } from '@angular/core';
import { MatButtonModule, MatButtonToggleModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { MapManager } from '../dto/manager/map-manager';
import { H21MapComponent } from './h21-map.component';
import { H21MapCircleDirective } from './h21-map-circle.directive';
import { H21MapMarkerDirective } from './h21-map-marker.directive';
import { H21MapClusterDirective } from './h21-map-cluster.directive';
import { H21MapDrawingManagerDirective } from './h21-map-drawing-manager.directive';
import { H21MaSearchDirective } from './h21-map-search-directive';
import { H21MapInfoBoxComponent } from './h21-map-info-box.component';
import { H21MaGeocodingDirective } from './h21-map-geocoding.directive';
import { H21MaRouteDirective } from './h21-map-route-directive';

import { GoogleMapService } from '../dto/providers/google/services/google-map';
import { GoogleMarkerClusterService } from '../dto/providers/google/services/google-cluster';
import { GoogleEventService } from '../dto/providers/google/services/google-event';
import { GoogleRouteBuilderService } from '../dto/providers/google/services/google-route';
import { GoogleMarkerService } from '../dto/providers/google/services/google-marker';
import { GoogleInfoBoxService } from '../dto/providers/google/services/google-info-box';
import { GoogleSearchService } from '../dto/providers/google/services/google-search';
import { GoogleCircleService } from '../dto/providers/google/services/google-circle';
import { GooglePolylineService } from '../dto/providers/google/services/google-polyline';
import { GoogleGeocodingService } from '../dto/providers/google/services/google-geocoding';
import { GooglePolygonService } from '../dto/providers/google/services/google-polygon';
import { GoogleGeoLocationService } from '../dto/providers/google/services/google-geolocation';
import { GoogleBoundsService } from '../dto/providers/google/services/google-bounds';
import { GoogleAreaService } from '../dto/providers/google/services/google-area';
import { GoogleApiConfig } from '../dto/providers/google/entity/google-api-config';
import { GoogleConversionsService } from '../dto/providers/google/services/google-conversions';

import { BaiduApiConfig } from '../dto/providers/baidu/entity/baidu-api-config';
import { BaiduConversionsService } from '../dto/providers/baidu/services/baidu-conversions';
import { BaiduMapService } from '../dto/providers/baidu/services/baidu-map';
import { BaiduMarkerClusterService } from '../dto/providers/baidu/services/baidu-cluster';
import { BaiduEventService } from '../dto/providers/baidu/services/baidu-event';
import { BaiduRouteBuilder } from '../dto/providers/baidu/services/baidu-route';
import { BaiduMarkerService } from '../dto/providers/baidu/services/baidu-marker';
import { BaiduInfoBoxService } from '../dto/providers/baidu/services/baidu-info-box';
import { BaiduSearchService } from '../dto/providers/baidu/services/baidu-search';

import { YandexMapService } from '../dto/providers/yandex/services/yandex-map';
import { YandexMarkerClusterService } from '../dto/providers/yandex/services/yandex-cluster';
import { YandexEventService } from '../dto/providers/yandex/services/yandex-event';
import { YandexRouteBuilderService } from '../dto/providers/yandex/services/yandex-route';
import { YandexMarkerService } from '../dto/providers/yandex/services/yandex-marker';
import { YandexInfoBoxService } from '../dto/providers/yandex/services/yandex-info-box';
import { YandexSearchService } from '../dto/providers/yandex/services/yandex-search';

import { LeafletApiConfig } from '../dto/providers/leaflet/entity/leaflet-api.config';
import { LeafletConversionsService } from '../dto/providers/leaflet/services/leaflet-conversions';
import { LeafletAreaService } from '../dto/providers/leaflet/services/leaflet-area';
import { LeafletMapService } from '../dto/providers/leaflet/services/leaflet-map';
import { LeafletMarkerClusterService } from '../dto/providers/leaflet/services/leaflet-cluster';
import { LeafletEventService } from '../dto/providers/leaflet/services/leaflet-event';
import { LeafletRouteBuilderService } from '../dto/providers/leaflet/services/leaflet-route';
import { LeafletMarkerService } from '../dto/providers/leaflet/services/leaflet-marker';
import { LeafletSearchService } from '../dto/providers/leaflet/services/leaflet-search';
import { LeafletInfoBoxService } from '../dto/providers/leaflet/services/leaflet-info-box';
import { LeafletCircleService } from '../dto/providers/leaflet/services/leaflet-circle';
import { LeafletPolylineService } from '../dto/providers/leaflet/services/leaflet-polyline';
import { LeafletPolygonService } from '../dto/providers/leaflet/services/leaflet-polygon';
import { LeafletGeocodingService } from '../dto/providers/leaflet/services/leaflet-geocoding';
import { LeafletGeoLocationService } from '../dto/providers/leaflet/services/leaflet-geolocation';
import { LeafletBoundsService } from '../dto/providers/leaflet/services/leaflet-bounds';

import { YandexApiConfig } from '../dto/providers/yandex/entity/yandex.api.config';
import { YandexConversionsService } from "../dto/providers/yandex/services/yandex-conversions";
import { YandexAreaService } from '../dto/providers/yandex/services/yandex-area';
import { YandexCircleService } from '../dto/providers/yandex/services/yandex-circle';
import { YandexPolylineService } from '../dto/providers/yandex/services/yandex-polyline';
import { YandexGeocodingService } from '../dto/providers/yandex/services/yandex-geocoding';
import { YandexPolygonService } from '../dto/providers/yandex/services/yandex-polygon';
import { YandexGeoLocationService } from '../dto/providers/yandex/services/yandex-geolocation';
import { YandexBoundsService } from '../dto/providers/yandex/services/yandex-bounds';

import { BaiduCircleService } from '../dto/providers/baidu/services/baidu-circle';
import { BaiduPolylineService } from '../dto/providers/baidu/services/baidu-polyline';
import { BaiduGeocodingService } from '../dto/providers/baidu/services/baidu-geocoding';
import { BaiduPolygonService } from '../dto/providers/baidu/services/baidu-polygon';
import { BaiduGeoLocationService } from '../dto/providers/baidu/services/baidu-geolocation';
import { BaiduBoundsService } from '../dto/providers/baidu/services/baidu-bounds';
import { BaiduAreaService } from '../dto/providers/baidu/services/baidu-area';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatTooltipModule,
    ],
    exports: [
        H21MapComponent,
        H21MapCircleDirective,
        H21MaRouteDirective,
        H21MapDrawingManagerDirective,
        H21MaSearchDirective,
        H21MapMarkerDirective,
        H21MapClusterDirective,
        H21MaGeocodingDirective,
        H21MapInfoBoxComponent
    ],
    declarations: [
        H21MapComponent,
        H21MapCircleDirective,
        H21MapMarkerDirective,
        H21MapClusterDirective,
        H21MapDrawingManagerDirective,
        H21MaSearchDirective,
        H21MaGeocodingDirective,
        H21MaRouteDirective,
        H21MapInfoBoxComponent
    ],
    providers: [
        HttpClient,
        MapManager,
        BaiduApiConfig,
        BaiduMapService,
        BaiduMarkerClusterService,
        BaiduEventService,
        BaiduRouteBuilder,
        BaiduMarkerService,
        BaiduInfoBoxService,
        BaiduSearchService,
        BaiduAreaService,
        BaiduCircleService,
        BaiduPolylineService,
        BaiduGeocodingService,
        BaiduPolygonService,
        BaiduGeoLocationService,
        BaiduBoundsService,
        BaiduConversionsService,
       
        H21MaRouteDirective,
        H21MapCircleDirective,

        YandexApiConfig,
        YandexMapService,
        YandexMarkerClusterService,
        YandexEventService,
        YandexRouteBuilderService,
        YandexInfoBoxService,
        YandexMarkerService,
        YandexSearchService,
        YandexCircleService,
        YandexPolylineService,
        YandexGeocodingService,
        YandexPolygonService,
        YandexGeoLocationService,
        YandexBoundsService,
        YandexAreaService,
        YandexConversionsService,

        GoogleApiConfig,
        GoogleMapService,
        GoogleMarkerClusterService,
        GoogleEventService,
        GoogleRouteBuilderService,
        GoogleMarkerService,
        GoogleInfoBoxService,
        GoogleSearchService,
        GoogleCircleService,
        GooglePolylineService,
        GoogleGeocodingService,
        GooglePolygonService,
        GoogleGeoLocationService,
        GoogleBoundsService,
        GoogleAreaService,
        GoogleConversionsService,

        LeafletApiConfig,
        LeafletMapService,
        LeafletMarkerClusterService,
        LeafletEventService,
        LeafletRouteBuilderService,
        LeafletInfoBoxService,
        LeafletMarkerService,
        LeafletSearchService,
        LeafletCircleService,
        LeafletPolylineService,
        LeafletGeocodingService,
        LeafletPolygonService,
        LeafletGeoLocationService,
        LeafletBoundsService,
        LeafletAreaService,
        LeafletConversionsService
    ],
})

export class H21MapModule {

}
