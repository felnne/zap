import streamlit as st

from zap.sections.base import Section


class ToolExport(Section):
    """Options to export the current record."""

    def render(self) -> None:
        """Render."""
        st.header("Export record")

        record = st.session_state.get("record")
        if not record:
            st.info("Set record config to enable export.")
            return

        st.download_button(
            key="record-output",
            label="Export Record",
            data=record.dumps_json(strip_admin=False),
            file_name=f"zap2-{record.file_identifier}.json",
            mime="application/json",
            icon=":material/download:",
        )
