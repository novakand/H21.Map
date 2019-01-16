import { Injectable } from "@angular/core";
import { MarkerClusterService } from "../../../services/abstract-cluster";
import { H21MapClusterDirective } from "projects/h21-map/src/components/h21-map-cluster.directive";
import { H21MapMarkerDirective } from "projects/h21-map/src/components/h21-map-marker.directive";

declare var L: any

@Injectable()
export class LeafletMarkerClusterService extends MarkerClusterService<L.Map, L.Marker> {

    markerCluster: L.MarkerClusterGroup;

    constructor() {
        super();
    }

    initMarkerCluster(cluster: H21MapClusterDirective) {

        this.markerCluster = new L.markerClusterGroup(
            <L.MarkerClusterGroupOptions>{
                chunkedLoading: false,
                maxClusterRadius: cluster.gridSize,
                showCoverageOnHover: false,

                iconCreateFunction: (clust) => {
                    var markers = clust.getAllChildMarkers();
                    var html = '<div class="markerClusLeaftlet">' + markers.length + '</div>';
                    return L.divIcon({ html: html, className: 'cluster', iconSize: L.point(cluster.width, cluster.height) });
                },
            });

        this.map.api.addLayer(this.markerCluster);
    }

    addMarker(marker: any): void {

        this.markerCluster.addLayer(this.map.marker.markers.get(marker));
    }

    removeMarker(marker: H21MapMarkerDirective): void {
        this.markerCluster.removeLayer(this.map.marker.markers.get(marker));
        this.map.marker.markers.delete(marker);
    }

    removeMarkers(): void {
        this.markerCluster.clearLayers();
    }

    resetViewport(): void {
        this.markerCluster.refreshClusters();
    }

    setGridSize(cluster: H21MapClusterDirective): void {
        throw new Error("Method not implemented.");
    }

    setMaxZoom(cluster: H21MapClusterDirective): void {
        throw new Error("Method not implemented.");
    }

    setZoomOnClick(cluster: H21MapClusterDirective): void {
        throw new Error("Method not implemented.");
    }

    setIconUrl(cluster: H21MapClusterDirective): void {
        throw new Error("Method not implemented.");
    }

    setIconSize(cluster: H21MapClusterDirective): void {
        throw new Error("Method not implemented.");
    }

    setMinimumClusterSize(cluster: H21MapClusterDirective): void {
        throw new Error("Method not implemented.");
    }

}
