import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import Graphic from '@arcgis/core/Graphic'
import { Polygon } from '@arcgis/core/geometry'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'
import Color from '@arcgis/core/Color'
import Camera from '@arcgis/core/Camera'

import type { EsriToken, WellKnownExtent } from '@/types/app'
import { getSetting } from '@/utils/data'
import { get2dBasemap, get3dBasemap } from '@/utils/esri'

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

  view.graphics.add(extentGraphic)
  view.goTo(extentGraphic)
}

export const initExtentGlobe = (
  /*
   * Creates a basic 3D scene
   *
   * Consists of a basemap with a feature loaded from a restricted feature service that corresponds to the given extent.
   * This is needed to load a feature with a densified geometry. This scene cannot show arbitrary geometries.
   */
  container: string,
  extent: WellKnownExtent,
  accessToken: EsriToken
) => {
  const basemap = get3dBasemap()

  const map = new Map({
    basemap: basemap,
    ground: 'world-elevation',
  })

  const view = new SceneView({
    container: container,
    map: map,
    ui: {
      components: ['attribution', 'zoom', 'navigation-toggle'],
    },
    environment: {
      lighting: {
        type: 'virtual',
      },
    },
  })

  const layer = make3dExtentLayer(extent, accessToken)
  map.add(layer)

  // zoom to feature
  navigateToFeature3d(view, layer)
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

export const make3dExtentLayer = (extent: WellKnownExtent, token: EsriToken): FeatureLayer => {
  /*
   * Get feature layer from secure feature service
   *
   * This feature layer contains features for each Well Know Extent, which use densified geometries to ensure they can
   * be displayed correctly in 3D and other projections. Each feature maps to a WKE via their slug (a property of the JS
   * object and attribute in the feature layer). This layer is populated using a related Python script.
   *
   * In ArcGIS Online, applications cannot be granted access to restricted feature services, therefore an access token
   * for a user acquired via OAuth is needed.
   */
  const endpoint = getSetting('app_extents_layer_endpoint')
  const layer = new FeatureLayer({ url: endpoint, apiKey: token.accessToken })
  layer.definitionExpression = `Slug = '${extent.slug}'`

  return layer
}

export const navigateToFeature3d = async (view: SceneView, layer: FeatureLayer) => {
  /*
   * Zoom to a given feature from a layer in a 3D scene
   *
   * The feature to zoom to is the given extent.
   *
   * When zoomed to the selected feature likely won't be visible (due to some sort of bug with layer visibility settings).
   * To work around this, the camera is zoomed out 300% after the initial zoom. This workaround is not suitable as it
   * doesn't work for all features.
   */
  const query = layer.createQuery()
  const results = await layer.queryFeatures(query)

  await view.when()
  await view.goTo({
    target: results.features[0],
    heading: 0,
    tilt: 0,
  })

  // Zoom back out to workaround visibility bug
  await view.goTo(
    new Camera({
      position: {
        x: view.camera.position.x,
        y: view.camera.position.y,
        z: view.viewpoint.camera.position.z * 3, // zooming out
        spatialReference: view.camera.position.spatialReference,
      },
      heading: view.camera.heading,
      tilt: view.camera.tilt,
    })
  )
}
