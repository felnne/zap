import logging

from bas_metadata_library.standards.magic_administration.v1.utils import AdministrationKeys
from bs4 import BeautifulSoup
from lantern.lib.metadata_library.models.record.record import Record
from lantern.models.record.revision import RecordRevision
from lantern.models.site import ExportMeta
from lantern.outputs.item_html import ItemCatalogueOutput


def _temp_select_record(identifier: str) -> RecordRevision:
    """Minimal fake related record lookup method."""
    config = {
        "file_identifier": identifier,
        "file_revision": "x",
        "hierarchy_level": "dataset",
        "metadata": {
            "contacts": [{"organisation": {"name": "x"}, "email": "x", "role": ["pointOfContact"]}],
            "date_stamp": "2014-06-30",
        },
        "identification": {
            "title": {"value": "x"},
            "dates": {"creation": "2014-06-30"},
            "abstract": "x",
            "language": "eng",
            "identifiers": [
                {
                    "identifier": "x",
                    "href": f"https://data.bas.ac.uk/items/{identifier}",
                    "namespace": "data.bas.ac.uk",
                }
            ],
        },
    }
    record = RecordRevision.loads(config)
    record.file_identifier = identifier
    return record


def preview_item(admin_keys: AdministrationKeys, record: Record) -> str:
    """Render record config as catalogue item HTML."""
    temp_logger = logging.Logger(__name__)
    meta = ExportMeta(
        env="preview",
        trusted=True,
        base_url="http://localhost:9000",
        build_key="x",
        html_title="x",
        embedded_maps_endpoint="x",
        items_enquires_endpoint="x",
        generator="x",
        version="x",
        parallel_jobs=1,
        admin_meta_keys=admin_keys,
        algolia_id="x",
        algolia_key="x",
        algolia_index="x",
    )
    record = RecordRevision.loads(value={**record.dumps(strip_admin=False), "file_revision": "x"})

    output = ItemCatalogueOutput(logger=temp_logger, meta=meta, record=record, select_record=_temp_select_record)
    html_str = output.content[0].content
    html_str = str(BeautifulSoup(html_str, parser="html.parser", features="lxml").prettify())
    return html_str.replace("/static/", "https://data.bas.ac.uk/static/")  # hack
