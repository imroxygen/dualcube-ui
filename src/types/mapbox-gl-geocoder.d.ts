declare module '@mapbox/mapbox-gl-geocoder' {
  import { Map, IControl } from 'mapbox-gl';

  interface GeocoderOptions {
    accessToken: string;
    marker?: boolean;
    mapboxgl?: typeof Map;
  }

  export default class MapboxGeocoder implements IControl {
    constructor(options: GeocoderOptions);
    on(event: string, callback: (ev: any) => void): void; // Add this
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
    getMapboxClient(): unknown;
  }
}
