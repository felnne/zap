from typing import TYPE_CHECKING

from lantern.lib.metadata_library.models.record.record import Record

from zap.catalogue import preview_item

if TYPE_CHECKING:
    from bas_metadata_library.standards.magic_administration.v1.utils import AdministrationKeys


class TestCatalogue:
    """Test catalogue handling functions."""

    def test_preview_item(self, fx_admin_meta_keys: AdministrationKeys, fx_record_config_cat_min: dict):
        """Can render a record as catalogue item HTML."""
        result = preview_item(admin_keys=fx_admin_meta_keys, record=Record.loads(fx_record_config_cat_min))
        assert isinstance(result, str)
