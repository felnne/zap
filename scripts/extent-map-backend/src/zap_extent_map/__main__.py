from pathlib import Path

from environs import Env

from zap_extent_map.agol import EsriClient
from zap_extent_map.data import load_extents_data, convert_extents_to_features


def main():
    env = Env()
    env.read_env()

    in_path = Path("../src/data/extents.json")
    agol_base_url = "https://www.arcgis.com"
    agol_username = env("APP_ZAP_AGOL_USERNAME")
    agol_password = env("APP_ZAP_AGOL_PASSWORD")
    agol_folder = "f2c218fdec964d008b0e7820a38ebfb5"
    agol_service_name = "zap_wke"
    agol_service_summary = (
        "Common geographic areas for describing the coverage of information in Zap ⚡."
    )
    agol_service_admin_description = (
        """Features representing items in Zap extents data file."""
    )
    agol_service_user_description = """
    Each feature in this layer represents a Well Known Extent, a commonly referenced geographic area (polygon) for
    describing the coverage of information (e.g. the whole Antarctic continent for continent-wide data).
    <br /><br />
    These extents are intended for ease of use and consistency. Areas can be simple or complex shapes as needed to
    accurately describe them. They should be suitably densified to support displaying in other projections.
    <br /><br />
    Each feature includes a name (for display) and a slug, which corresponds to a slug value used by one of the items
    in the <i>Zap ⚡️</i> extents data file.
    <br /><br />
    Features are managed programmatically by <a href="https://gitlab.data.bas.ac.uk/felnne/zap"><i>Zap ⚡️</i></a>.
    """
    agol_service_licence = """
    Copyright (c) 2021-2024 UK Research and Innovation (UKRI), British Antarctic Survey (BAS).
    This information is licensed under the Open Government Licence v3.0. To view this licence,
    visit http://www.nationalarchives.gov.uk/doc/open-government-licence/.
    """
    agol_service_crs = 4326
    agol_layer_name = agol_service_name
    agol_layer_definition = {
        "layers": [
            {
                "currentVersion": 11.2,
                "id": 0,
                "name": agol_layer_name,
                "type": "Feature Layer",
                "displayField": "NAME",
                "description": agol_service_user_description,
                "copyrightText": agol_service_licence,
                "defaultVisibility": True,
                "minScale": 0,  # world
                "maxScale": 147914381,  # room
                "geometryType": "esriGeometryPolygon",
                "objectIdField": "OBJECTID",
                "uniqueIdField": {"name": "OBJECTID", "isSystemMaintained": True},
                "fields": [
                    {
                        "name": "OBJECTID",
                        "type": "esriFieldTypeOID",
                        "alias": "OBJECTID",
                        "sqlType": "sqlTypeOther",
                        "nullable": False,
                        "editable": False,
                        "domain": None,
                        "defaultValue": None,
                    },
                    {
                        "name": "SLUG",
                        "type": "esriFieldTypeString",
                        "actualType": "nvarchar",
                        "alias": "Slug",
                        "sqlType": "sqlTypeNVarchar",
                        "length": 255,
                        "nullable": True,
                        "editable": True,
                        "domain": None,
                        "defaultValue": None,
                    },
                    {
                        "name": "NAME",
                        "type": "esriFieldTypeString",
                        "actualType": "nvarchar",
                        "alias": "Name",
                        "sqlType": "sqlTypeNVarchar",
                        "length": 255,
                        "nullable": True,
                        "editable": True,
                        "domain": None,
                        "defaultValue": None,
                    },
                ],
                "indexes": [
                    {
                        "name": "SLUG_Index",
                        "fields": "SLUG",
                        "isAscending": False,
                        "isUnique": True,
                        "description": "Slug unique constraint",
                    }
                ],
                "hasStaticData": False,
            }
        ]
    }
    agol_layer_id = agol_layer_definition["layers"][0]["id"]

    print(f"Loading extents from: {in_path.absolute()}")
    extents = load_extents_data(in_path)
    features = convert_extents_to_features(extents=extents, densify_tolerance=2)

    agol = EsriClient(
        base_url=agol_base_url, auth_username=agol_username, auth_password=agol_password
    )

    print(f"Creating feature service: {agol_layer_name} - (this takes several seconds)")
    agol_service_endpoint, agol_service_item_id = agol.create_feature_service(
        name=agol_service_name,
        crs=agol_service_crs,
        user=agol_username,
        folder=agol_folder,
        summary=agol_service_summary,
        admin_description=agol_service_admin_description,
        user_description=agol_service_user_description,
        licence=agol_service_licence,
    )

    print("Creating layer in feature service - (this takes several seconds)")
    agol_layer_endpoint = f"{agol_service_endpoint}/{agol_layer_id}"
    agol.add_to_feature_service(
        endpoint=agol_service_endpoint, layer_definition=agol_layer_definition
    )
    # agol.fix_feature_layer_scale(endpoint=agol_layer_endpoint)

    print("Adding features to layer")
    agol.add_feature_collection_to_feature_layer(
        endpoint=agol_layer_endpoint, feature_collection=features
    )

    print(f"Feature Service - Endpoint: {agol_service_endpoint}")
    print(
        f"Feature Service - Item ID: https://bas.maps.arcgis.com/home/item.html?id={agol_service_item_id}"
    )
    print(f"Feature Layer - Endpoint: {agol_layer_endpoint}")


if __name__ == "__main__":
    main()
