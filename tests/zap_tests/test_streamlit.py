from bas_metadata_library.standards.magic_administration.v1.utils import AdministrationKeys
from streamlit.testing.v1 import AppTest

from zap.utils import load_secrets


class TestStreamlitApp:
    """Test Streamlit app."""

    @staticmethod
    def _app_script() -> None:
        from zap.app import app

        app()

    def test_app(self):
        """
        Can load app.

        Serves as a limited integration test for some features.

        See `e2e_tests.streamlit.test_workflow.TestWorkflowStreamlit.test_workflow` for a more complete e2e test.
        """
        at = AppTest.from_function(self._app_script)
        at.secrets.update(load_secrets(read_dotenv=False))  # .env not loaded as pytest-env values will be used
        at.run()
        assert not at.exception

        # check session state post init
        assert isinstance(at.session_state.admin_meta_keys, AdministrationKeys)

        # check title is correct and section is included
        assert at.title[0].body == "⚡️Zap II"

        # check initial state
        assert any(e.value == "Set record to enable validation." for e in at.info)
