import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Graphic from '@arcgis/core/Graphic'
import { Polygon } from '@arcgis/core/geometry'
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'
import Color from '@arcgis/core/Color'

import { get2dBasemap } from '@/lib/esri'

/*
 * Functions in this module are not tested.
 *
 * Dependencies used by the ArcGIS API for JavaScript do not support testing in a Node.js environment used by vitest.
 * Esri are aware of this limitation, and are investigating a solution, but is dependent on an upstream library they use.
 */

export const initExtentMap = (container: string, extent: WellKnownExtent) => {
  /*
   * Creates a basic 2D map
   *
   * Consists of a basemap with a single polygon graphic representing the given extent.
   */
  const basemap = get2dBasemap()
  const extentGraphic = make2dExtentGraphic(extent)

  const map = new Map({
    basemap: basemap,
  })

  const view = new MapView({
    container: container,
    map: map,
    ui: {
      components: ['attribution'],
    },
  })
  view.when(() => {
    view.graphics.add(extentGraphic)
  })
}

export const loadCssTheme = () => {
  /*
   * Imports the appropriate ArcGIS JS SDK CSS theme based on the user's colour preference
   *
   * This method does not react to the colour reference changing (I.e. once loaded the app will need reloading to
   * switch theme).
   */
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    import('@arcgis/core/assets/esri/themes/dark/main.css')
  } else {
    import('@arcgis/core/assets/esri/themes/light/main.css')
  }
}

export const make2dExtentGraphic = (extent: WellKnownExtent): Graphic => {
  /*
   * Construct a polygon graphic from a Well Known Extent
   *
   * The graphic layer is a single polygon with a simple style (mapped to tailwind's colour pallet for consistency)
   * The polygon geometry is based on the extent's bounding box in the form:
   *
   * [
   *   [bbox[west], bbox[south]],
   *   [bbox[east], bbox[south]],
   *   [bbox[east], bbox[north]],
   *   [bbox[west], bbox[north]],
   *   [bbox[west], bbox[south]],
   * ]
   *
   * Where: [west, east, south, north] = [xmin, ymin, xmax, ymax]
   */
  const bbox = [
    extent.extent.geographic.bounding_box.west_longitude,
    extent.extent.geographic.bounding_box.east_longitude,
    extent.extent.geographic.bounding_box.north_latitude,
    extent.extent.geographic.bounding_box.south_latitude,
  ]

  const extentPolygon = new Polygon({
    rings: [
      [
        [bbox[0], bbox[2]],
        [bbox[1], bbox[2]],
        [bbox[1], bbox[3]],
        [bbox[0], bbox[3]],
        [bbox[0], bbox[2]],
      ],
    ],
    spatialReference: { wkid: 4326 },
  })

  const polygonSymbol = new SimpleFillSymbol({
    color: new Color([237, 137, 54, 0.5]), // orange-500 with transparency
    outline: new SimpleLineSymbol({
      color: new Color([237, 137, 54]), // orange-500
      width: 2,
    }),
  })

  return new Graphic({
    geometry: extentPolygon,
    symbol: polygonSymbol,
  })
}
