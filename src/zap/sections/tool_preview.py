import logging
from typing import TYPE_CHECKING

import streamlit as st
from bas_metadata_library.standards.magic_administration.v1 import AdministrationMetadata
from bs4 import BeautifulSoup
from cattrs import ClassValidationError
from lantern.lib.metadata_library.models.record.record import Record, RecordInvalidError
from lantern.lib.metadata_library.models.record.utils.admin import get_admin
from lantern.models.record.record import Record as RecordCatalogue
from lantern.models.record.revision import RecordRevision
from lantern.models.site import ExportMeta
from lantern.outputs.item_html import ItemCatalogueOutput

from zap.sections.base import Section

if TYPE_CHECKING:
    from bas_metadata_library.standards.magic_administration.v1.utils import AdministrationKeys


class ToolPreview(Section):
    """Record and Item preview."""

    def __init__(self, admin_keys: AdministrationKeys) -> None:
        self._admin_keys = admin_keys

    @staticmethod
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

    def _get_record_admin(self, record: Record) -> AdministrationMetadata | None:
        """Get administration metadata from record if defined."""
        return get_admin(keys=self._admin_keys, record=record)

    def _preview_item(self, record: RecordCatalogue) -> str:
        """Render record config as catalogue item HTML."""
        temp_logger = logging.getLogger(__name__)
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
            admin_meta_keys=self._admin_keys,
            algolia_id="x",
            algolia_key="x",
            algolia_index="x",
        )
        record = RecordRevision.loads(value={**record.dumps(strip_admin=False), "file_revision": "x"})

        output = ItemCatalogueOutput(
            logger=temp_logger, meta=meta, record=record, select_record=self._temp_select_record
        )
        html_str = output.content[0].content
        html_str = str(BeautifulSoup(html_str, parser="html.parser", features="lxml").prettify())
        return html_str.replace("/static/", "https://data.bas.ac.uk/static/")  # hack

    def render(self) -> None:
        """Render section."""
        st.header("Lantern 🏮 item preview")

        record = st.session_state.get("record", None)
        if not isinstance(record, Record):
            st.info("Set record to enable preview.", icon="ℹ️")  # noqa: RUF001
            return

        admin = self._get_record_admin(record)

        item_html = None
        try:
            cat_record = RecordCatalogue.loads(record.dumps(strip_admin=False))
            cat_record.validate()
            item_html = self._preview_item(record=record)
        except RecordInvalidError, ClassValidationError:
            pass

        config_tab, source_tab, preview_tab = st.tabs(["Config", "Source", "Preview"])
        with config_tab:
            with st.expander(label="Administration metadata"):
                if not isinstance(admin, AdministrationMetadata):
                    st.info("Set admin metadata in record to enable preview.", icon="ℹ️")  # noqa: RUF001
                    st.warning(
                        body="Admin metadata cannot be loaded from real records because this app uses test/insecure keys.",
                        icon="🔑",
                    )
                else:
                    st.json(admin.unstructure())

            with st.expander(label="Discovery metadata"):
                st.json(record.dumps(strip_admin=False))
        with source_tab:
            if item_html:
                st.code(body=item_html, language="html")
            else:
                st.error("Record is not valid for preview.", icon="❌️")
        with preview_tab:
            if item_html:
                st.iframe(src=item_html)
            else:
                st.error("Record is not valid for preview.", icon="❌")
