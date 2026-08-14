import pytest
from lantern.lib.metadata_library.models.record.record import Record
from streamlit.testing.v1 import AppTest


class TestImportSection:
    """Test import tool section."""

    @staticmethod
    def _app_script() -> None:
        from zap.sections.tool_import import ToolImport

        section = ToolImport()
        section.render()

    def test_render(self):
        """Can render section."""
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert at.header[0].body == "Import record"

    def test_upload(self, fx_record_config_iso_min: dict):
        """Can upload a valid record config file."""
        expected = Record.loads(fx_record_config_iso_min)
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert "record" not in at.session_state

        content = expected.dumps_json(strip_admin=False)
        at.file_uploader[0].upload(filename="record.json", content=content.encode(), mime_type="application/json")
        at.run()
        assert len(at.error) == 0
        assert at.session_state.record == expected

    @pytest.mark.cov()
    def test_upload_invalid(self, fx_record_config_iso_min: dict):
        """Can upload an invalid JSON file."""
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert "record" not in at.session_state

        content = "x"
        # need to use expected extension to trigger our internal error as Streamlit widget checks as a first pass
        at.file_uploader[0].upload(filename="record.json", content=content.encode(), mime_type="text/plain")
        at.run()
        assert len(at.error) == 1
        assert at.error[0].value == "Uploaded file is not valid JSON and cannot be loaded 😢"
        assert "record" not in at.session_state
