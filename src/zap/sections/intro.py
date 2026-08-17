import streamlit as st

from zap.sections.base import Section


class IntroSection(Section):
    """Introduction."""

    def render(self) -> None:
        """Render section."""
        st.title("⚡️Zap II")
