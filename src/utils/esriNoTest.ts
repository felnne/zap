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

export const initExtentMap = (container: string, extent: WellKnownExtent) => {
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
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    import('@arcgis/core/assets/esri/themes/dark/main.css')
  } else {
    import('@arcgis/core/assets/esri/themes/light/main.css')
  }
}

export const make2dExtentGraphic = (extent: WellKnownExtent): Graphic => {
  // bbox order: [west, east, south, north] / [xmin, ymin, xmax, ymax]
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
  const endpoint = getSetting('app_extents_layer_endpoint')
  const layer = new FeatureLayer({ url: endpoint, apiKey: token.accessToken })
  layer.definitionExpression = `Slug = '${extent.slug}'`

  return layer
}

export const navigateToFeature3d = async (view: SceneView, layer: FeatureLayer) => {
  const query = layer.createQuery()
  const results = await layer.queryFeatures(query)

  await view.when()
  await view.goTo({
    target: results.features[0],
    heading: 0,
    tilt: 0,
  })

  // This is a workaround for feature visibility issue when not zoomed out enough
  await view.goTo(
    new Camera({
      position: {
        x: view.camera.position.x,
        y: view.camera.position.y,
        z: view.viewpoint.camera.position.z * 3, // 300% of previous value (zooming out)
        spatialReference: view.camera.position.spatialReference,
      },
      heading: view.camera.heading,
      tilt: view.camera.tilt,
    })
  )
}
