import pytest
from streamlit.testing.v1 import AppTest


class TestExportSection:
    """Test export tool section."""

    @staticmethod
    def _app_script() -> None:
        from zap.sections.tool_export import ToolExport

        section = ToolExport()
        section.render()

    def test_render(self):
        """Can render section."""
        at = AppTest.from_function(self._app_script())
        at.run()
        assert not at.exception
        assert at.header[0].body == "Export record"

    @pytest.mark.cov()
    def test_empty(self):
        """Cannot download without a current record."""
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert at.info[0].value == "Set record config to enable export."
        assert len(at.button) == 0

    # Can't test downloads tab as download buttons aren't supported by AT logic (resolves to UnknownElement)
    # https://docs.streamlit.io/develop/concepts/app-testing/cheat-sheet#limitations
