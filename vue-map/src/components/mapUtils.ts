import { ref } from 'vue';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Circle from '@arcgis/core/geometry/Circle';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';

export function updateCenter(view: any, coords: any, rad: any, gl: GraphicsLayer) {
    // const coordinatesInput = (document.getElementById('coordinates') as HTMLInputElement).value;
    // const radius = parseInt((document.getElementById('options') as HTMLInputElement).value);

    const coordinatesInput = coords.value;
    const radius = rad.value;
    console.log(radius);
    const coordinates = coordinatesInput.split(',').map(Number);
  
    if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
      const [longitude, latitude] = coordinates;
  
      view.center = [longitude, latitude];
  
      // Clear existing graphics
      gl.removeAll();
  
      // Add pin
      const point = new Point({
        longitude: longitude,
        latitude: latitude,
        spatialReference: { wkid: 4326 } 
      });
  
      const markerSymbol = new SimpleMarkerSymbol({
        color: [226, 119, 40],
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      });

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,

      });
  
      gl.add(pointGraphic);
  
      // Add circle
      const circle = new Circle({
        center: point,
        radius: radius, // radius in meters
        radiusUnit: 'meters',
        spatialReference: { wkid: 4326 } 
      });
  
      const fillSymbol = new SimpleFillSymbol({
        color: [255, 0, 0, 0.25],
        outline: {
          color: [255, 0, 0],
          width: 1
        }
      });

      // Create a graphic and add it to the graphics layer
      let geodesicCircle = geometryEngine.geodesicBuffer(point, radius, "meters");
      if (Array.isArray(geodesicCircle)) {
        geodesicCircle = geodesicCircle[0];
      }
      
      const circleGraphic = new Graphic({
        geometry: geodesicCircle,
        symbol: fillSymbol
      });

      console.log(circleGraphic);

      gl.add(circleGraphic);
  
      // Calculate the extent of the circle and expand it
      const circleExtent = circle.extent.expand(1.2); // Expand by 5%
  
      // Set view to the circle extent
      view.goTo({
        target: circleExtent
      });
    } else {
      alert('Please enter valid coordinates in the format "longitude, latitude".');
    }
}
