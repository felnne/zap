from pathlib import Path

from streamlit.testing.v1 import AppTest


class TestStreamlitApp:
    """Test Streamlit app."""

    def test_app(self):
        """Can load app."""
        app_path = Path(__file__).parent.parent.parent / "src" / "zap" / "streamlit_app.py"
        at = AppTest.from_file(app_path)
        at.run()

        # check title is correct
        assert at.title[0].body == "⚡️Zap II"
