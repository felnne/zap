import json
import logging
import http.client
from typing import Optional

import requests
from geojson import FeatureCollection


class EsriClient:
    def __init__(
        self,
        base_url: str,
        auth_username: str,
        auth_password: str,
        debug_requests: bool = False,
    ):
        self._base_url: str = base_url
        self._auth_username: str = auth_username
        self._auth_password: str = auth_password
        self._auth_token: str = ""

        if debug_requests:
            http.client.HTTPConnection.debuglevel = 1
            logging.basicConfig()
            logging.getLogger().setLevel(logging.DEBUG)
            requests_log = logging.getLogger("requests.packages.urllib3")
            requests_log.setLevel(logging.DEBUG)
            requests_log.propagate = True

    @property
    def _token(self) -> str:
        if not self._auth_token:
            self._auth_token = self._get_token()

        return self._auth_token

    def _get_token(self) -> str:
        req = requests.post(
            url=f"{self._base_url}/sharing/generateToken",
            params={
                "f": "json",
            },
            data={
                "username": self._auth_username,
                "password": self._auth_password,
                "referer": "localhost",
            },
        )
        req.raise_for_status()

        return req.json()["token"]

    @staticmethod
    def _convert_geojson_features_to_esri(
        feature_collection: FeatureCollection,
    ) -> list[dict]:
        return [
            {
                "attributes": feature["properties"],
                "geometry": {
                    "rings": feature["geometry"]["coordinates"],
                    "spatialReference": {"wkid": 4326},
                },
            }
            for feature in feature_collection["features"]
        ]

    def create_feature_service(
        self,
        name: str,
        crs: int,
        user: Optional[str] = None,
        folder: Optional[str] = None,
        summary: Optional[str] = None,
        admin_description: Optional[str] = None,
        user_description: Optional[str] = None,
        licence: Optional[str] = None,
    ) -> tuple[str, str]:
        path = self._auth_username
        if user:
            path = user
        if folder:
            path = f"{path}/{folder}"

        create_parameters = {
            "name": name,
            "hasStaticData": False,
            "spatialReference": {"wkid": crs},
        }
        if admin_description:
            create_parameters["serviceDescription"] = admin_description
        if user_description:
            create_parameters["description"] = user_description
        if licence:
            create_parameters["copyrightText"] = licence

        data = {
            "f": "json",
            "token": self._token,
            "outputType": "featureService",
            "createParameters": json.dumps(create_parameters),
        }
        if summary:
            data["snippet"] = summary
        if user_description:
            data["description"] = user_description

        req = requests.post(
            url=f"{self._base_url}/sharing/rest/content/users/{path}/createService",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data=data,
        )
        req.raise_for_status()

        return req.json()["encodedServiceURL"], req.json()["itemId"]

    def add_to_feature_service(self, endpoint: str, layer_definition: dict) -> None:
        endpoint = endpoint.replace("/rest/", "/rest/admin/")

        data = {
            "f": "json",
            "token": self._token,
            "addToDefinition": json.dumps(layer_definition),
        }

        req = requests.post(
            url=f"{endpoint}/addToDefinition",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data=data,
        )
        req.raise_for_status()

    def update_feature_layer(self, endpoint: str, layer_definition: dict) -> None:
        endpoint = endpoint.replace("/rest/", "/rest/admin/")

        data = {
            "f": "json",
            "token": self._token,
            "updateDefinition": json.dumps(layer_definition),
        }

        req = requests.post(
            url=f"{endpoint}/updateDefinition",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data=data,
        )
        req.raise_for_status()

        print(req.json())

    # def fix_feature_layer_scale(self, endpoint: str) -> None:
    #     layer_definition = {'minScale': 0, 'maxScale': 147_914_381}
    #
    #     # self.update_feature_layer(endpoint=endpoint, layer_definition={'minScale': 100, 'maxScale': 100_000})
    #     self.update_feature_layer(endpoint=endpoint, layer_definition=layer_definition)

    def add_to_feature_layer(self, endpoint: str, features: list[dict]) -> None:
        data = {
            "f": "json",
            "token": self._token,
            "features": json.dumps(features),
        }

        req = requests.post(
            url=f"{endpoint}/addFeatures",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data=data,
        )
        req.raise_for_status()

        for result in req.json()["addResults"]:
            if not result["success"]:
                raise Exception(f"Failed to add feature: {result}")

    def add_feature_collection_to_feature_layer(
        self, endpoint: str, feature_collection: FeatureCollection
    ) -> None:
        self.add_to_feature_layer(
            endpoint, self._convert_geojson_features_to_esri(feature_collection)
        )
