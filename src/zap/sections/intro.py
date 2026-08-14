import streamlit as st

from zap.sections.base import Section


class IntroSection(Section):
    """Introduction."""

    def render(self) -> None:
        """Render section."""
        st.warning(
            body="This app uses test/insecure keys for admin metadata and so cannot be used with real records.",
            icon="🔑",
        )
        st.title("⚡️Zap II")
