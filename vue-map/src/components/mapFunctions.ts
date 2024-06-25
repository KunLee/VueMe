import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { updateCenter } from './mapUtils'; // Import utility functions
let map: any; // Declare map globally
let view: any; // Declare view globally
let graphicsLayer: GraphicsLayer;

export function initializeMap(myElement: { value: HTMLDivElement | null }, coordinates:any, radius:any) {
  
  graphicsLayer = new GraphicsLayer();

  // Load the ArcGIS API modules
  map = new Map({
    basemap: 'topo-vector'
  });

  view = new MapView({
    container: myElement.value!,
    map: map,
    center: [151.2093, -33.8688], // Longitude, latitude
    zoom: 4 // Zoom level
  });

  map.add(graphicsLayer);

  window.onload = function (view) {
    updateCenter(view, coordinates, radius, graphicsLayer);
  };

  view.when(() => {
    console.log("Spatial Reference of the map view:", view.spatialReference);
  }).catch((error: any) => {
    console.error("Error initializing view:", error);
  });
}

export { map, view, graphicsLayer };