import sys
from hashlib import sha1
from pathlib import Path
from tempfile import TemporaryDirectory

from flask import Flask, request, url_for
from flask_cors import CORS
from werkzeug.utils import secure_filename

from zap_pdf.utils import pdf_xml

CRS_LOOKUP = {
    "PROJCS[\"WGS_1984_Antarctic_Polar_Stereographic\",GEOGCS[\"GCS_WGS_1984\",DATUM[\"D_WGS_1984\",SPHEROID[\"WGS_1984\",6378137.0,298.257223563]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Stereographic_South_Pole\"],PARAMETER[\"False_Easting\",0.0],PARAMETER[\"False_Northing\",0.0],PARAMETER[\"Central_Meridian\",0.0],PARAMETER[\"Standard_Parallel_1\",-71.0],UNIT[\"Meter\",1.0]]": "3031"
}

def check_georef(path: Path) -> dict:
    result = {"geo_referenced": False, "crs": None, "crs_raw": None, "exp_bbox": []}

    xml = pdf_xml(path)
    gpts_key = xml.find('key', text='GPTS')
    if gpts_key:
        result['geo_referenced'] = True

        gpts_value = gpts_key.find_next_sibling('value')
        if gpts_value:
            numbers = gpts_value.find_all('number')
            coordinates = [float(number.text) for number in numbers]
            # Group coordinates into pairs
            coordinate_pairs = [coordinates[i:i + 2] for i in range(0, len(coordinates), 2)]
            result['bbox'] = coordinate_pairs

        crs_wkt_key = xml.find('key', text='WKT')
        if crs_wkt_key:
            crs_wkt_value = crs_wkt_key.find_next_sibling('value')
            if crs_wkt_value:
                result['crs_raw'] = crs_wkt_value.text
        if result['crs_raw'] in CRS_LOOKUP:
            result['crs'] = CRS_LOOKUP[result['crs_raw']]

    return result

def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object("zap_pdf.config")
    CORS(app)

    @app.route("/v1/meta/health")
    def health() -> dict:
        return {
            "status": "pass",
            "version": 1,
            "releaseId": app.config["VERSION"],
            "description": "Tools for handling PDF files in Zap ⚡️ metadata editor.",
            "links": {
                "self": url_for(endpoint="health", _external=True),
                "about": "https://gitlab.data.bas.ac.uk/felnne/zap",
            },
        }

    @app.route("/v1/check", methods=["POST"])
    def check():
        if 'file' not in request.files:
            return {"error": "No file part"}, 400

        file = request.files['file']
        if file.filename == '':
            return {"error": "No file selected"}, 400
        if not file.filename.endswith(".pdf"):
            return {"error": "Invalid file type (not PDF)"}, 400
        filename = secure_filename(file.filename)

        with TemporaryDirectory() as upload_dir:
            upload_file = Path(upload_dir) / filename
            file.save(upload_file)

            with upload_file.open(mode="rb") as f:
                file_hash = sha1(f.read()).hexdigest()

            geo_ref = check_georef(upload_file)

        result = {"name": filename, "sha1": file_hash, **geo_ref}
        return result

    return app
