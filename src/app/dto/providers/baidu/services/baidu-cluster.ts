import { Injectable, NgZone } from "@angular/core";
import { MarkerCluster } from '@h21-map/baidu-markercluster';
import { MarkerClusterService } from "../../../services/abstract-cluster";
import { H21MapClusterDirective } from "projects/h21-map/src/components/h21-map-cluster.directive";
import { H21MapMarkerDirective } from "projects/h21-map/src/components/h21-map-marker.directive";

declare var BMap;

@Injectable()
export class BaiduMarkerClusterService extends MarkerClusterService<BMap.Map, BMap.Marker> {

    markerCluster: any;

    constructor(private _zone: NgZone) {
        super();
    }

    initMarkerCluster(cluster: H21MapClusterDirective): void {

        const options = [{
            url: cluster.iconUrl,
            size: new BMap.Size(cluster.width, cluster.height),
            textColor: cluster.textColor,
        }];

        this.markerCluster = new MarkerCluster(this.map.api);
        this.markerCluster.setStyles(options);
        this.markerCluster.setGridSize(cluster.gridSize);
        this.markerCluster.setMinClusterSize(cluster.minimumClusterSize);
    }

    addMarker(marker: H21MapMarkerDirective): void {
        this.markerCluster.addMarker(this.map.marker.markers.get(marker));
    }

    addMarkers(markers: H21MapMarkerDirective[]): void {
        this.markerCluster.addMarkers(markers);
    }

    removeMarker(marker: H21MapMarkerDirective): void {
        this.markerCluster.removeMarker(this.map.marker.markers.get(marker));
        this.map.marker.markers.delete(marker);
    }

    removeMarkers(): void {
        this.markerCluster.clearMarkers();
        this.map.marker.markers.clear();
    }

    resetViewport(): void {
        this.markerCluster._redraw();
    }

    setGridSize(cluster: H21MapClusterDirective): void {
        this.markerCluster.setGridSize(cluster.gridSize);
    }

    setMaxZoom(cluster: H21MapClusterDirective): void {
        this.markerCluster.setMaxZoom(cluster.maxZoom);
    }

    setZoomOnClick(cluster: H21MapClusterDirective): void {
        throw new Error("Method not implemented.");
    }

    setIconUrl(cluster: H21MapClusterDirective): void {

        const icon = [{
            url: cluster.iconUrl,
        }];
        this.markerCluster.setStyles(icon);
    }

    setIconSize(cluster: H21MapClusterDirective): void {
        const size = [{
            size: new BMap.Size(cluster.width, cluster.height),
        }];

        this.markerCluster.setStyles(size);
    }
    setMinimumClusterSize(cluster: H21MapClusterDirective): void {
        this.markerCluster.setMinClusterSize(cluster.minimumClusterSize);
    }
}
