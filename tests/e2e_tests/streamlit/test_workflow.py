import json

from lantern.lib.metadata_library.models.record.record import Record
from streamlit.testing.v1 import AppTest

from tests.zap_tests.sections.test_export import CaptureDownloads
from zap.utils import load_secrets


class TestWorkflowStreamlit:
    """E2E workflow tests with Streamlit app testing framework."""

    @staticmethod
    def _app_script() -> None:
        from zap.app import app

        app()

    def test_workflow(self, fx_record_config_iso_minish: dict):
        """
        Can run a basic import -> validate -> preview -> export workflow.

        Functionally equivilant to `e2e_tests.browser.test_workflow.TestWorkflowPlaywright.test_workflow`.
        """
        expected = Record.loads(fx_record_config_iso_minish)

        with CaptureDownloads() as download_btn:
            at = AppTest.from_function(self._app_script)
            at.secrets.update(load_secrets(read_dotenv=False))  # .env not loaded as pytest-env values will be used

            ## Initialise app
            at.run()
            assert not at.exception
            assert at.session_state.record != expected  # no initial record

            ## Import record
            content = expected.dumps_json(strip_admin=False)
            at.file_uploader[0].upload(filename="record.json", content=content.encode(), mime_type="application/json")
            at.run()
            assert at.session_state.record == expected

            ## Validate record
            assert any(e.value == "Record config meets MAGIC profile requirements 🥳" for e in at.success)

            ## Preview record
            assert len(at.tabs) == 3  # noqa: PLR2004
            config_tab = at.tabs[0]  # represents all tabs in all sections/groups
            discovery_expander = config_tab.expander[1]
            assert json.loads(discovery_expander.json[0].value)["file_identifier"] == expected.file_identifier

            ## Export record
            at.download_button[0].click()
            download_config = json.loads(download_btn.get_download(at.download_button[0]))
            download_record = Record.loads(download_config)
            assert download_record == expected

            assert len(at.error) == 0
