import json
from pathlib import Path
from subprocess import Popen

from lantern.lib.metadata_library.models.record.record import Record
from playwright.sync_api import Page, expect

from tests.conftest import _get_test_record_path


class TestWorkflowPlaywright:
    """
    E2E workflow tests with Playwright.

    Useful debugging steps:

    ```
    page.screenshot(path="./x.png")
    ```

    ```
    with Path("./page_content.html").open(mode="w") as f:
        f.write(page.content())
    ```
    """

    def test_basic(self, page: Page, fx_app: Popen, fx_app_url: str):
        """Can access Streamlit app."""
        page.goto(fx_app_url)
        page.get_by_text("Running...").wait_for(state="detached")
        expect(page).to_have_title("Zap II")

    def test_workflow(self, page: Page, fx_app: Popen, fx_app_url: str, tmp_path: Path):
        """
        Can run a basic import -> validate -> preview -> export workflow.

        Functionally equivilant to `e2e_tests.streamlit.test_workflow.TestWorkflowStreamlit.test_workflow`.
        """
        ## Load a known file (signed/encrypted with test keys)
        input_path = _get_test_record_path("all-valid.json")
        assert input_path.exists()
        with input_path.open() as f:
            expected = Record.loads(json.load(f))
            file_identifier = expected.file_identifier
        assert expected is not None
        assert file_identifier is not None

        page.goto(fx_app_url)
        page.get_by_text("Running...").wait_for(state="detached")

        ## Import record
        file_input = page.locator('input[type="file"]').first
        file_input.set_input_files(input_path)
        # Check input_path.name is visible on the page
        # (make sure file name is short enough not to be truncated by Streamlit widget)
        page.get_by_text(input_path.name).wait_for(state="visible")

        ## Preview record
        # Click Config tab and expand 'Discovery metadata' expander (summary/button element, not the content)
        config_tab = page.get_by_role("tab", name="Config")
        config_tab.click()
        config_panel = page.get_by_role("tabpanel", name="Config")
        discovery_expander = config_panel.locator("summary").filter(has_text="Discovery metadata")
        discovery_expander.click()
        # Check file_identifier is present at least once in the Discovery expander content
        discovery_content = discovery_expander.locator("..").locator("..")
        expect(discovery_content.locator(f"text={file_identifier}").first).to_be_visible()

        ## Validate record
        expect(page.get_by_text("Record config meets MAGIC profile requirements 🥳")).to_be_visible()

        ## Export Record
        download_path = tmp_path / "downloaded_record.json"
        with page.expect_download() as download_info:
            page.get_by_role("button", name="Export Record").click()
        download = download_info.value
        download.save_as(download_path)

        ## Load exported record and compare to original import
        with download_path.open() as f:
            downloaded_record = Record.loads(json.load(f))
        assert downloaded_record.file_identifier == file_identifier
        assert downloaded_record == expected
