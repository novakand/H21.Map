import { Injectable } from "@angular/core";
import { MarkerClusterService } from "../../../services/abstract-cluster";
import { H21MapMarkerDirective } from "projects/h21-map/src/components/h21-map-marker.directive";
import { H21MapClusterDirective } from "projects/h21-map/src/components/h21-map-cluster.directive";

@Injectable()
export class YandexMarkerClusterService extends MarkerClusterService<ymaps.Map,ymaps.GeoObject> {

    markerCluster: any;

    constructor() {
        super();
    }

    initMarkerCluster(cluster: H21MapClusterDirective): void {
        const icon = [
            {
                href: cluster.iconUrl,
                size: [cluster.width, cluster.height],
                offset: [-20, -20]
            },
        ]

        const options = <ymaps.IClustererOptions>{
            clusterIcons: icon,
            clusterDisableClickZoom: !cluster.zoomOnClick,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
            minClusterSize: cluster.minimumClusterSize,
            maxZoom: cluster.maxZoom,
            groupByCoordinates: false,
            gridSize: cluster.gridSize,
            hasBalloon: false,
        }

        this.markerCluster = new ymaps.Clusterer(options);
        this.map.api.geoObjects.add(this.markerCluster);

    }
    addMarker(marker: H21MapMarkerDirective): void {
        this.markerCluster.add(this.map.marker.markers.get(marker));
    }

    removeMarker(marker: H21MapMarkerDirective): void {
        this.markerCluster.remove(this.map.marker.markers.get(marker));
        this.map.marker.markers.delete(marker);
    }

    removeMarkers(): void {
        this.markerCluster.removeAll();
        this.map.marker.markers.clear();
    }

    setGridSize(cluster: H21MapClusterDirective): void {
        this.markerCluster.options.set({
            gridSize: cluster.gridSize,
        });
    }

    setMaxZoom(cluster: H21MapClusterDirective): void {
        this.markerCluster.options.set({
            maxZoom: cluster.maxZoom
        });
    }

    setZoomOnClick(cluster: H21MapClusterDirective): void {
        this.markerCluster.options.set({
            clusterDisableClickZoom: cluster.zoomOnClick
        });
    }

    setIconUrl(cluster: H21MapClusterDirective): void {
        let clusterIcons = [
            {
                href: cluster.iconUrl,
                size: [cluster.width, cluster.height],

            },
        ]
        this.markerCluster.options.set({
            clusterIcons: clusterIcons
        });
    }

    setIconSize(cluster: H21MapClusterDirective): void {
        let clusterIcons = [
            {
                size: [cluster.width, cluster.height],

            },
        ]
        this.markerCluster.options.set({
            clusterIcons: clusterIcons
        });
    }

    setMinimumClusterSize(cluster: H21MapClusterDirective): void {
        this.markerCluster.options.set({
            minClusterSize: cluster.minimumClusterSize,
        });
    }

    resetViewport(): void {
        throw new Error("Method not implemented.");
    }

}
