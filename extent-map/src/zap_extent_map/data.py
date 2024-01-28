import json
from pathlib import Path

from geojson import Polygon, coords as geojson_coords, Feature, FeatureCollection
from shapely import Polygon as ShapelyPolygon, segmentize
from shapely.geometry import mapping as shapely_mapping


def load_extents_data(path: Path) -> list[dict]:
    with path.open() as f:
        data = json.load(f)
        return data["geographic"].values()


def convert_iso_bbox_to_polygon(bbox: list[float]) -> Polygon:
    """
    Rearranges a set of compass coordinates (North, East, etc.) into a GeoJSON Polygon:
    - the first coordinate is also the last to close the shape.
    - `bbox` order is: west, east, south, north.
    """
    # noinspection PyTypeChecker
    geom = Polygon(
        [
            [
                [bbox[0], bbox[2]],
                [bbox[1], bbox[2]],
                [bbox[1], bbox[3]],
                [bbox[0], bbox[3]],
                [bbox[0], bbox[2]],
            ]
        ]
    )

    if not geom.is_valid:
        raise RuntimeError("Invalid Coordinates")

    return geom


def densify_polygon(polygon: Polygon, tolerance: float) -> Polygon:
    """
    Adds additional vertices to a polygon.

    The bulk of this function is marshaling the coordinates data between GeoJSON and Shapely.
    The `tolerance` parameter is the max distance between vertices, in the units of the polygon's CRS (4326 = degrees).
    """
    geom = ShapelyPolygon(list(geojson_coords(polygon)))
    geom = segmentize(geom, tolerance)
    return Polygon(shapely_mapping(geom)["coordinates"])


def convert_extent_to_feature(extent: dict, tolerance: float = 0) -> Feature:
    """
    Rearranges app specific data structure into a GeoJSON Feature.

    If `tolerance` is > 0, feature geometries will be densified to support plotting in other projections.
    """
    bbox = extent["extent"]["geographic"]["bounding_box"]
    coordinates = [
        bbox["west_longitude"],
        bbox["east_longitude"],
        bbox["north_latitude"],
        bbox["south_latitude"],
    ]
    geom = convert_iso_bbox_to_polygon(coordinates)

    if tolerance > 0:
        geom = densify_polygon(geom, tolerance)

    properties = {"slug": extent["slug"], "name": extent["name"]}

    return Feature(geometry=geom, properties=properties)


def convert_extents_to_features(
    extents: list[dict], densify_tolerance: float = 0
) -> FeatureCollection:
    """
    See `convert_extent_to_feature` for purpose of `densify_tolerance` parameter.
    """
    features = []

    for extent in extents:
        features.append(
            convert_extent_to_feature(extent=extent, tolerance=densify_tolerance)
        )

    collection = FeatureCollection(features)

    if not collection.is_valid:
        raise RuntimeError("Invalid GeoJSON")

    return collection
