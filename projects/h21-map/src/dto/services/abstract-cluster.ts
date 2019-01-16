import { Injectable } from "@angular/core";
import { MapService } from "./abstract-map";
import { H21MapMarkerDirective } from "../../components/h21-map-marker.directive";
import { H21MapClusterDirective } from "../../components/h21-map-cluster.directive";

@Injectable()
export abstract class MarkerClusterService<T, U> {

  map: MapService<T, U>;

  initMap(map: MapService<T, U>): void {
    this.map = map;
  }

  abstract initMarkerCluster(cluster: H21MapClusterDirective): void;

  abstract addMarker(marker: H21MapMarkerDirective): void;

  abstract removeMarker(marker: H21MapMarkerDirective): void;

  abstract removeMarkers(): void;

  abstract resetViewport(): void;

  abstract setGridSize(cluster: H21MapClusterDirective): void

  abstract setMaxZoom(cluster: H21MapClusterDirective): void;

  abstract setZoomOnClick(cluster: H21MapClusterDirective): void

  abstract setIconUrl(cluster: H21MapClusterDirective): void;

  abstract setIconSize(cluster: H21MapClusterDirective): void;

  abstract setMinimumClusterSize(cluster: H21MapClusterDirective): void;

}
