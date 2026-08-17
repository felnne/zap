import json
from typing import TYPE_CHECKING

import pytest
from bas_metadata_library.standards.magic_administration.v1 import AdministrationMetadata
from lantern.lib.metadata_library.models.record.record import Record
from lantern.models.record.record import Record as RecordCatalogue
from streamlit.testing.v1 import AppTest

from tests.conftest import add_min_admin_meta
from zap.sections.tool_preview import ToolPreview
from zap.utils import load_secrets

if TYPE_CHECKING:
    from bas_metadata_library.standards.magic_administration.v1.utils import AdministrationKeys


class TestPreviewSectionLogic:
    """Test preview tool logic."""

    @pytest.mark.cov()
    def test_get_admin(self, fx_admin_meta_keys: AdministrationKeys, fx_record_config_iso_minish: dict):
        """Can get admin metadata from a record."""
        add_min_admin_meta(fx_record_config_iso_minish)
        record = Record.loads(fx_record_config_iso_minish)

        section = ToolPreview(admin_keys=fx_admin_meta_keys)
        result = section._get_record_admin(record)
        assert isinstance(result, AdministrationMetadata)

    @pytest.mark.cov()
    def test_preview_item(self, fx_admin_meta_keys: AdministrationKeys, fx_record_config_cat_min: dict):
        """Can render a record as catalogue item HTML."""
        record = RecordCatalogue.loads(fx_record_config_cat_min)
        section = ToolPreview(admin_keys=fx_admin_meta_keys)
        result = section._preview_item(record)
        assert isinstance(result, str)


class TestPreviewSectionUI:
    """Test preview tool UI."""

    @staticmethod
    def _app_script() -> None:
        import streamlit as st
        from bas_metadata_library.standards.magic_administration.v1.utils import AdministrationKeys
        from jwskate import Jwk

        from zap.sections.tool_preview import ToolPreview

        admin_keys = AdministrationKeys(
            encryption_private=Jwk(st.secrets.admin_metadata.encryption_key_private),
            signing_private=Jwk(st.secrets.admin_metadata.signing_key_private),
        )
        section = ToolPreview(admin_keys=admin_keys)
        section.render()

    def test_render(self, fx_record_config_magic: dict):
        """Can render section."""
        expected = Record.loads(fx_record_config_magic)
        at = AppTest.from_function(self._app_script)
        at.secrets.update(load_secrets(read_dotenv=False))  # .env not loaded as pytest-env values will be used
        at.session_state.record = expected
        at.run()

        assert not at.exception
        assert at.header[0].body == "Preview item"

        assert len(at.tabs) == 3  # noqa: PLR2004
        config_tab, source_tab, _preview_tab = at.tabs
        admin_expander = config_tab.expander[0]
        discovery_expander = config_tab.expander[1]
        assert json.loads(admin_expander.json[0].value)["id"] == expected.file_identifier  # admin
        assert json.loads(discovery_expander.json[0].value)["file_identifier"] == expected.file_identifier
        assert f'<meta content="{expected.identification.title}" property="og:title"/>' in source_tab.code[0].value
        # Can't test preview tab as iframes aren't supported by AT logic (resolves to UnknownElement)

    @pytest.mark.cov()
    @pytest.mark.parametrize("value", [None, "x"])
    def test_empty(self, value: str | None):
        """
        Cannot preview without a current record.

        This includes a non-Record value.
        """
        at = AppTest.from_function(self._app_script)
        at.secrets.update(load_secrets(read_dotenv=False))
        at.session_state.record = value
        at.run()

        assert not at.exception
        assert at.info[0].value == "Set record configuration to enable preview."
        # should have no other output
        assert len(at.info) == 1
        assert len(at.success) == 0
        assert len(at.error) == 0
        assert len(at.tabs) == 0

    @pytest.mark.cov()
    def test_empty_admin(self, fx_record_config_magic: dict):
        """Cannot preview admin metadata if not included in the current record."""
        record = Record.loads(fx_record_config_magic)
        record.identification.supplemental_information = None
        at = AppTest.from_function(self._app_script)
        at.secrets.update(load_secrets(read_dotenv=False))
        at.session_state.record = record

        at.run()
        assert not at.exception
        assert any(e.value == "Set admin metadata in record to enable preview." for e in at.info)

    @pytest.mark.cov()
    def test_invalid(self, fx_record_config_magic: dict):
        """Cannot preview invalid metadata."""
        record = Record.loads(fx_record_config_magic)
        record.identification.title = None
        at = AppTest.from_function(self._app_script)
        at.secrets.update(load_secrets(read_dotenv=False))
        at.session_state.record = record

        at.run()
        assert not at.exception
        assert all(e.value == "Record config is not valid for preview." for e in at.error)
        # should have no other output
        assert len(at.info) == 0
        assert len(at.success) == 0
        assert len(at.error) == 2  # noqa: PLR2004
