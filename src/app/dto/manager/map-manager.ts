import { Injectable } from "@angular/core";
import { MapService } from "../services/abstract-map";
import { MapType } from "../enum/e-map-type";
import { GoogleMapService } from "../providers/google/services/google-map";
import { BaiduMapService } from "../providers/baidu/services/baidu-map";
import { YandexMapService } from "../providers/yandex/services/yandex-map";
import { LeafletMapService } from "../providers/leaflet/services/leaflet-map";

@Injectable()
export class MapManager {

    mapType: MapType;
    private map: MapService<any,any>;
    hashtable: { [name: string]: MapService<any,any>; } = {};

    constructor(
        private googleMap: GoogleMapService,
        private baiduMap: BaiduMapService,
        private yandexMap: YandexMapService,
        private leafletMap: LeafletMapService
    ) {
        this.register(MapType.GOOGLE, googleMap);
        this.register(MapType.BAIDU, baiduMap);
        this.register(MapType.YANDEX, yandexMap);
        this.register(MapType.LEAFLET, leafletMap);
    }

    private get currentMap(): MapService<any,any> {
        return this.map;
    }

    public selectMap(type: MapType): void {
        this.destroy();
        this.map = this.hashtable[type];
        this.currentMap.loadAPI();

    }

    register(type: MapType, map: MapService<any,any>): MapManager {
        this.hashtable[type] = map;
        return this;
    }

    destroy(): void {
        try {
            this.currentMap.destroy();
        }
        catch{ }
    }
    public changeType(type: MapType): void {
        this.mapType = type;
    }
    public getMap(): MapService<any,any> {
        return this.map;
    }
}
