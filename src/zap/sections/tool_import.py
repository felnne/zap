import json

import streamlit as st
from cattrs import ClassValidationError
from lantern.lib.metadata_library.models.record.record import Record

from zap.sections.base import Section
from zap.utils import flatten_exceptions


class ToolImport(Section):
    """Options to import a record."""

    def render(self) -> None:
        """Render."""
        st.header("Import record")

        config_file = st.file_uploader(
            key="record-input", label="Upload", type=["json"], max_upload_size=1, accept_multiple_files=False
        )
        if config_file is None:
            st.session_state.record = None
            return
        try:
            uploaded_config = json.loads(config_file.getvalue().decode("utf-8"))
            record = Record.loads(uploaded_config)
            st.session_state.record = record
        except json.JSONDecodeError:
            st.error("Uploaded file cannot be parsed as JSON 😶", icon="❌")
            st.session_state.record = None
        except ClassValidationError as e_group:
            st.error("Uploaded file cannot be parsed as a base ISO 19115 record 😵", icon="❌")
            with st.expander("Record parsing errors") as expander:
                for e in flatten_exceptions(e_group):
                    expander.exception(e)
            st.session_state.record = None
