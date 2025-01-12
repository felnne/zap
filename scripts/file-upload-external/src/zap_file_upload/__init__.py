from pathlib import Path
from tempfile import TemporaryDirectory
from typing import IO
from mimetypes import MimeTypes

from environs import env
from flask import Flask, request, url_for
from flask_cors import CORS
from werkzeug.utils import secure_filename
from boto3 import client as boto_client


def _upload_file_to_s3(app: Flask, path: str, content: IO, media_type: str) -> None:
    s3_client = boto_client(
        "s3",
        aws_access_key_id=app.config["AWS_ACCESS_KEY"],
        aws_secret_access_key=app.config["AWS_SECRET_ACCESS_KEY"],
    )

    s3_client.upload_fileobj(
        Fileobj=content, 
        Bucket=app.config["AWS_BUCKET"], 
        Key=path, 
        ExtraArgs={'ContentType': media_type, 'ContentDisposition': 'inline'}
    )

def _determine_media_type(filename: str) -> str:
    db = MimeTypes()
    return db.guess_type(filename)[0] or "application/octet-stream"


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object("zap_file_upload.config")

    env.read_env()
    app.config["AWS_ACCESS_KEY"] = env("AWS_ACCESS_KEY")
    app.config["AWS_SECRET_ACCESS_KEY"] = env("AWS_SECRET_ACCESS_KEY")

    CORS(app, expose_headers="Location")

    @app.route("/v1/meta/health")
    def health() -> dict:
        return {
            "status": "pass",
            "version": 1,
            "releaseId": app.config["VERSION"],
            "description": "File hosting features for Zap ⚡️ editor.",
            "links": {
                "self": url_for(endpoint="health", _external=True),
                "about": "https://gitlab.data.bas.ac.uk/felnne/zap",
            },
        }

    @app.route("/v1/upload", methods=["POST"])
    def upload():
        resource_identifier = request.headers.get("app-file-identifier")
        if not resource_identifier:
            return {"error": "No app-file-identifier header"}, 400

        if "file" not in request.files:
            return {"error": "No file part"}, 400

        file = request.files["file"]
        if file.filename == "":
            return {"error": "No file selected"}, 400

        filename = secure_filename(file.filename)
        media_type = _determine_media_type(filename)

        path = f"add-catalogue/0.0.0/img/items/{resource_identifier}/{filename}"
        url = f"https://{app.config['AWS_BUCKET']}/{path}"

        with TemporaryDirectory() as upload_dir:
            upload_file = Path(upload_dir) / filename
            file.save(upload_file)

            with upload_file.open(mode="rb") as f:
                _upload_file_to_s3(app, path, f, media_type)

        return "", 201, {"Location": url}

    return app
