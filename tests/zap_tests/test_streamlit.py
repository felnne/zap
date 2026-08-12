from pathlib import Path

from bas_metadata_library.standards.magic_administration.v1.utils import AdministrationKeys
from lantern.lib.metadata_library.models.record.record import Record
from streamlit.testing.v1 import AppTest


class TestStreamlitApp:
    """Test Streamlit app."""

    def test_app(self):
        """Can load app."""
        app_path = Path(__file__).parent.parent.parent / "src" / "zap" / "streamlit_app.py"
        at = AppTest.from_file(app_path)
        at.run()
        assert not at.exception

        # check session state post init
        assert isinstance(at.session_state.admin_meta_keys, AdministrationKeys)
        assert isinstance(at.session_state.record, Record)

        # check title is correct and section is included
        assert at.title[0].body == "⚡️Zap II"

        # check default record validates
        assert any(e.value == "Record config meets MAGIC profile requirements 🥳" for e in at.success)
