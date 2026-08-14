from bas_metadata_library.standards.magic_administration.v1 import AdministrationMetadata
from bas_metadata_library.standards.magic_administration.v1.utils import AdministrationKeys, set_admin
from lantern.lib.metadata_library.models.record.record import Record

from zap.records import get_record_admin, init_record


class TestRecords:
    """Test record handling functions."""

    def test_init_record(self, fx_admin_meta_keys: AdministrationKeys):
        """Can create a blank, valid, record."""
        result = init_record(fx_admin_meta_keys)
        assert isinstance(result, Record)

    def test_get_admin(self, fx_admin_meta_keys: AdministrationKeys, fx_record_config_iso_min: dict):
        """Can get admin metadata from a record."""
        set_admin(
            keys=fx_admin_meta_keys,
            config=fx_record_config_iso_min,
            admin_meta=AdministrationMetadata(id=fx_record_config_iso_min["file_identifier"]),
        )
        result = get_record_admin(admin_keys=fx_admin_meta_keys, record=Record.loads(fx_record_config_iso_min))
        assert isinstance(result, AdministrationMetadata)
