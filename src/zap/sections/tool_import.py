import json

import streamlit as st
from lantern.lib.metadata_library.models.record.record import Record

from zap.sections.base import Section


class ToolImport(Section):
    """Options to import a record."""

    def render(self) -> None:
        """Render."""
        st.header("Import record")

        config_file = st.file_uploader(
            key="record-input", label="Upload", type=["json"], max_upload_size=1, accept_multiple_files=False
        )
        if config_file is not None:
            try:
                uploaded_config = json.loads(config_file.getvalue().decode("utf-8"))
                record = Record.loads(uploaded_config)
                st.session_state.record = record
            except json.JSONDecodeError:
                st.error("Uploaded file is not valid JSON and cannot be loaded 😢")
