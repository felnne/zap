import json

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

    def test_upload(self, fx_record_config_iso_minish: dict):
        """Can upload a valid record config file."""
        expected = Record.loads(fx_record_config_iso_minish)
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert at.session_state.record is None

        content = expected.dumps_json(strip_admin=False)
        at.file_uploader[0].upload(filename="record.json", content=content.encode(), mime_type="application/json")
        at.run()
        assert len(at.error) == 0
        assert at.session_state.record == expected

    @pytest.mark.cov()
    def test_reset(self, fx_record_config_iso_minish: dict):
        """Can upload a valid record config file, then clear the input."""
        expected = Record.loads(fx_record_config_iso_minish)
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert at.session_state.record is None

        content = expected.dumps_json(strip_admin=False)
        at.file_uploader[0].upload(filename="record.json", content=content.encode(), mime_type="application/json")
        at.run()
        assert len(at.error) == 0
        assert not at.exception
        assert at.session_state.record == expected

        at.file_uploader[0].clear()
        at.run()
        assert len(at.error) == 0
        assert not at.exception
        assert at.session_state.record is None

    @pytest.mark.cov()
    def test_upload_invalid_json(self):
        """Cannot upload an invalid JSON file."""
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert at.session_state.record is None

        # need to use expected extension to trigger our internal error as Streamlit widget checks as a first pass
        at.file_uploader[0].upload(filename="record.json", content=b"x", mime_type="text/plain")
        at.run()
        assert len(at.error) == 1
        assert at.error[0].value == "Uploaded file cannot be parsed as JSON 😶"
        assert at.session_state.record is None

    @pytest.mark.cov()
    def test_upload_invalid_record(self, fx_record_config_iso_minish: dict):
        """
        Cannot upload a config that can't be loaded as a base record.

        Specifically where Cattrs can't structure elements that are supported in the BAS ISO JSON Schema but not in the
        Python data classes.
        """
        fx_record_config_iso_minish["identification"]["constraints"] = [
            {
                "type": "access",
                "restriction_code": "otherRestrictions",
                "href": "http://example.com/#constraint-without-statement",
            }
        ]
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert at.session_state.record is None

        content = json.dumps(fx_record_config_iso_minish, ensure_ascii=False)
        at.file_uploader[0].upload(filename="record.json", content=content.encode(), mime_type="application/json")
        at.run()
        assert len(at.error) == 1
        assert at.error[0].value == "Uploaded file cannot be parsed as a base ISO 19115 record 😵"
        assert at.session_state.record is None
