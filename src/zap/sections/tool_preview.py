import streamlit as st
from bas_metadata_library.standards.magic_administration.v1 import AdministrationMetadata
from bas_metadata_library.standards.magic_administration.v1.utils import AdministrationKeys
from cattrs import ClassValidationError
from lantern.lib.metadata_library.models.record.record import Record, RecordInvalidError
from lantern.models.record.record import Record as RecordCatalogue

from zap.catalogue import preview_item
from zap.records import get_record_admin
from zap.sections.base import Section


class ToolPreview(Section):
    """Record and Item preview."""

    def __init__(self, admin_keys: AdministrationKeys) -> None:
        self._admin_keys = admin_keys

    def render(self) -> None:
        """Render section."""
        st.header("Preview item")

        record = st.session_state.get("record", None)
        if not isinstance(record, Record):
            st.info("Set record configuration to enable preview.", icon="ℹ️")  # noqa: RUF001
            return

        admin = get_record_admin(admin_keys=self._admin_keys, record=record)

        item_html = None
        try:
            cat_record = RecordCatalogue.loads(record.dumps(strip_admin=False))
            cat_record.validate()
            item_html = preview_item(admin_keys=self._admin_keys, record=record)
        except RecordInvalidError, ClassValidationError:
            pass

        config_tab, source_tab, preview_tab = st.tabs(["Config", "Source", "Preview"])
        with config_tab:
            with st.expander(label="Administration metadata"):
                if not isinstance(admin, AdministrationMetadata):
                    st.info("Set admin metadata in record to enable preview.", icon="ℹ️")  # noqa: RUF001
                else:
                    st.json(admin.unstructure())

            with st.expander(label="Discovery metadata"):
                st.json(record.dumps(strip_admin=False))
        with source_tab:
            if item_html:
                st.code(body=item_html, language="html")
            else:
                st.error("Record config is not valid for preview.", icon="❌️")
        with preview_tab:
            if item_html:
                st.iframe(src=item_html)
            else:
                st.error("Record config is not valid for preview.", icon="❌")
