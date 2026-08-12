import streamlit as st
from lantern.lib.metadata_library.models.record.record import Record, RecordInvalidError, RecordSchema
from lantern.models.record.record import Record as RecordCatalogue

from zap.sections.base import Section


class ToolValidate(Section):
    """Current record validation status."""

    def render(self) -> None:
        """Render."""
        st.header("Record validation")

        record = st.session_state.get("record", None)
        if not isinstance(record, Record):
            st.info("Set record config to enable validation.", icon="ℹ️")  # noqa: RUF001
            return

        try:
            record.validate(use_profiles=False)
            st.success("Record config is valid 🙂", icon="✅")
        except RecordInvalidError as e:
            st.error("Record config is invalid 😞", icon="❌")
            st.exception(e)
            return

        cat_record = RecordCatalogue.loads(record.dumps(strip_admin=False))
        try:
            cat_record.validate(use_profiles=False)
            st.success("Record config meets catalogue requirements 😀", icon="✅")
        except RecordInvalidError as e:
            st.error("Record config does not meet catalogue requirements 😢", icon="❌")
            st.exception(e)

        try:
            cat_record.validate(force_schemas=[RecordSchema.MAGIC_DISCO_V2, RecordSchema.MAGIC_ADMIN_V1])
            st.success("Record config meets MAGIC profile requirements 🥳", icon="✅")
        except RecordInvalidError as e:
            st.error("Record config does not meet MAGIC profile requirements 😭", icon="❌")
            st.exception(e)
