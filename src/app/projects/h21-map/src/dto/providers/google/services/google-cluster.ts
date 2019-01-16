import { Injectable } from "@angular/core";
import { MarkerClusterService } from "../../../services/abstract-cluster";
import { MarkerCluster } from '@h21-map/google-markercluster'
import { H21MapMarkerDirective } from "projects/h21-map/src/components/h21-map-marker.directive";
import { H21MapClusterDirective } from "projects/h21-map/src/components/h21-map-cluster.directive";
import { CallbackName } from "../../../enum/e-callback-name";


@Injectable()
export class GoogleMarkerClusterService extends MarkerClusterService<google.maps.Map, google.maps.Marker> {

  markerCluster:any

  constructor() {
    super();
  }

  initMarkerCluster(cluster: H21MapClusterDirective): void {

    const icon = [
      {
        textColor: cluster.textColor,
        url: cluster.iconUrl,
        anchorText: [0, 0],
        height: cluster.height,
        width: cluster.width
      }];

    const options = <any>{
      gridSize: cluster.gridSize,
      maxZoom: cluster.maxZoom,
      zoomOnClick: cluster.zoomOnClick,
      ignoreHidden: false,
      styles: icon
    };
    this.markerCluster = new MarkerCluster(this.map.api, [], options);
  }

  addMarker(marker: H21MapMarkerDirective): void {
    this.markerCluster.addMarker(this.map.marker.markers.get(marker));
  }

  removeMarker(marker: H21MapMarkerDirective): void {
    this.markerCluster.removeMarker(this.map.marker.markers.get(marker), false);
    this.map.marker.markers.delete(marker);
    this.map.callbackMap.emit(CallbackName.countLoadMarkers, this.map.marker.markers.size);
  }

  removeMarkers() {
    this.markerCluster.clearMarkers();
  }

  resetViewport(): void {
    this.markerCluster.draw();
  }

  setGridSize(cluster: H21MapClusterDirective): void {
    this.markerCluster.setGridSize(cluster.gridSize);
  }

  setMaxZoom(cluster: H21MapClusterDirective): void {
    this.markerCluster.setMaxZoom(cluster.maxZoom);
  }

  setZoomOnClick(cluster: H21MapClusterDirective): void {
    this.markerCluster.setZoomOnClick(cluster.zoomOnClick);

  }

  setIconUrl(cluster: H21MapClusterDirective): void {
    this.markerCluster.setImagePath(cluster.iconUrl);
  }

  setIconSize(cluster: H21MapClusterDirective): void {
    this.markerCluster.setImageSizes([cluster.width, cluster.height]);
  }

  setMinimumClusterSize(cluster: H21MapClusterDirective): void {
    this.markerCluster.setMinimumClusterSize(cluster.minimumClusterSize);
  }
}
