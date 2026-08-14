import streamlit as st
from bas_metadata_library.standards.magic_administration.v1.utils import AdministrationKeys
from jwskate import Jwk

from zap.records import init_record
from zap.sections.intro import IntroSection
from zap.sections.tool_export import ToolExport
from zap.sections.tool_import import ToolImport
from zap.sections.tool_preview import ToolPreview
from zap.sections.tool_validate import ToolValidate


def _init() -> None:
    """
    Initialise application.

    - loads secrets from Streamlit secrets store
    - initialises valid record with defaults and placeholders
    - configures streamlit app
    """
    if "admin_meta_keys" not in st.session_state:
        st.session_state.admin_meta_keys = AdministrationKeys(
            encryption_private=Jwk(st.secrets.admin_metadata.encryption_key_private),
            signing_private=Jwk(st.secrets.admin_metadata.signing_key_private),
        )

    if "record" not in st.session_state:
        st.session_state.record = init_record(admin_keys=st.session_state["admin_meta_keys"])

    st.set_page_config(layout="wide", page_title="Zap II", page_icon="⚡️")


def app() -> None:
    """Streamlit app entrypoint."""
    _init()

    intro_section = IntroSection()
    tool_import = ToolImport()
    tool_export = ToolExport()
    tool_validate = ToolValidate()
    tool_preview = ToolPreview(admin_keys=st.session_state["admin_meta_keys"])

    intro_section.render()
    left_col, right_col = st.columns(2)
    with left_col:
        tool_import.render()
        tool_export.render()
        tool_validate.render()
    with right_col:
        tool_preview.render()


if __name__ == "__main__":
    app()
