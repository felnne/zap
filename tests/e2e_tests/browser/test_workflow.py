import json
from typing import TYPE_CHECKING

from lantern.lib.metadata_library.models.record.record import Record
from playwright.sync_api import Page, expect

if TYPE_CHECKING:
    from pathlib import Path
    from subprocess import Popen


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

    def test_workflow(
        self, page: Page, fx_app: Popen, fx_app_url: str, tmp_path: Path, fx_record_config_iso_minish: dict
    ):
        """
        Can run a basic import -> validate -> preview -> export workflow.

        Does not check administration metadata.

        Functionally equivilant to `e2e_tests.streamlit.test_workflow.TestWorkflowStreamlit.test_workflow`.
        """
        expected = Record.loads(fx_record_config_iso_minish)
        file_identifier = expected.file_identifier
        input_path = tmp_path / "imported_record.json"
        with input_path.open(mode="w") as f:
            json.dump(fx_record_config_iso_minish, f, ensure_ascii=False)

        page.goto(fx_app_url)
        page.get_by_text("Running...").wait_for(state="detached")

        ## Import record
        file_input = page.locator('input[type="file"]').first
        file_input.set_input_files(input_path)
        # Ensure input_path.name is visible on the page after upload
        # (make sure file name is short enough not to be truncated by Streamlit widget)
        page.get_by_text(input_path.name).wait_for(state="visible")

        ## Preview record
        # Click Config tab and expand the 'Discovery metadata' expander (summary/button element, not the content)
        config_tab = page.get_by_role("tab", name="Config")
        config_tab.click()
        config_panel = page.get_by_role("tabpanel", name="Config")
        discovery_expander = config_panel.locator("summary").filter(has_text="Discovery metadata")
        discovery_expander.click()
        # Ensure file_identifier is present at least once in the 'Discovery metadata' expander content
        discovery_content = discovery_expander.locator("..").locator("..")
        expect(discovery_content.locator(f"text={file_identifier}").first).to_be_visible()

        ## Ensure record is shown as valid
        expect(page.get_by_text("Record config is valid 🙂")).to_be_visible()

        ## Export Record
        export_path = tmp_path / "exported_record.json"
        with page.expect_download() as download_info:
            page.get_by_role("button", name="Export Record").click()
        download = download_info.value
        download.save_as(export_path)

        ## Ensure exported record matches original import
        with export_path.open() as f:
            downloaded_record = Record.loads(json.load(f))
        assert downloaded_record.file_identifier == file_identifier
        assert downloaded_record == expected
