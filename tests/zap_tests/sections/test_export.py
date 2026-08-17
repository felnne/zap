import json
from typing import TYPE_CHECKING
from unittest.mock import patch

import pytest
from lantern.lib.metadata_library.models.record.record import Record
from streamlit.runtime.runtime import Runtime as RuntimeClass
from streamlit.testing.v1 import AppTest
from streamlit.testing.v1.local_script_runner import LocalScriptRunner

if TYPE_CHECKING:
    from pathlib import Path

if TYPE_CHECKING:
    from streamlit.testing.v1.element_tree import DownloadButton


class CaptureDownloads:
    """
    Context manager to capture media files created during Streamlit test runs.

    Allows access the file content returned by a Streamlit download button (i.e. when clicked, what downloads).

    Example:
    with CaptureDownloads() as download_btn:
        at = AppTest.from_function(my_script)
        at.session_state.record = my_record
        at.run()

        content = download_btn.get_download(at.download_button[0])
        assert content is not None
    """

    def __init__(self):  # noqa
        self._captured_media_mgr = None
        self.patcher = None
        self.original_local_run = None

    def __enter__(self):  # noqa
        self._captured_media_mgr = None
        self.original_local_run = LocalScriptRunner.run

        def patched_local_run(runner_self, *args, **kwargs):  # noqa
            # Capture to instance attribute, not global
            if RuntimeClass._instance and hasattr(RuntimeClass._instance, "media_file_mgr"):
                self._captured_media_mgr = RuntimeClass._instance.media_file_mgr
            return self.original_local_run(runner_self, *args, **kwargs)

        self.patcher = patch.object(LocalScriptRunner, "run", patched_local_run)
        self.patcher.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):  # noqa
        self.patcher.stop()
        return False

    def get_download(self, btn: DownloadButton) -> str:
        """Get file content from download button."""
        if self._captured_media_mgr is None:
            msg = "Media manager not captured."
            raise RuntimeError(msg) from None

        file_name = btn.proto.url.replace("/mock/media/", "")
        file_obj = self._captured_media_mgr._storage.get_file(file_name)
        return file_obj.content.decode()


class TestExportSection:
    """Test export tool section."""

    @staticmethod
    def _app_script() -> None:
        from zap.sections.tool_export import ToolExport

        section = ToolExport()
        section.render()

    def test_render(self):
        """Can render section."""
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert at.header[0].body == "Export record"

    @pytest.mark.cov()
    def test_empty(self):
        """Cannot download without a current record."""
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert at.info[0].value == "Set record to enable export."
        assert len(at.button) == 0

    def test_export(self, tmp_path: Path, fx_record_config_iso_minish: dict):
        """
        Can download current record and verify file content.

        The Streamlit AppTest framework does not allow direct access to download button content. The `CaptureDownloads`
        context manager is used as a workaround to capture the file content, then return it for comparison.
        """
        expected = Record.loads(fx_record_config_iso_minish)

        with CaptureDownloads() as download_btn:
            at = AppTest.from_function(self._app_script)
            at.session_state.record = expected
            at.run()
            assert not at.exception

            at.download_button[0].click()
            download_config = json.loads(download_btn.get_download(at.download_button[0]))
            download_record = Record.loads(download_config)
            assert download_record == expected
