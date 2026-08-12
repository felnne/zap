from datetime import UTC, datetime
from uuid import uuid4

from bas_metadata_library.standards.magic_administration.v1 import AdministrationMetadata
from bas_metadata_library.standards.magic_administration.v1.utils import AdministrationKeys
from lantern.lib.metadata_library.models.record.elements.common import Date, Dates
from lantern.lib.metadata_library.models.record.elements.data_quality import DataQuality, Lineage
from lantern.lib.metadata_library.models.record.elements.identification import (
    BoundingBox,
    Extent,
    ExtentGeographic,
    Extents,
    Identification,
)
from lantern.lib.metadata_library.models.record.enums import HierarchyLevelCode, MaintenanceFrequencyCode, ProgressCode
from lantern.lib.metadata_library.models.record.presets.base import RecordMagicOpen
from lantern.lib.metadata_library.models.record.record import Record
from lantern.lib.metadata_library.models.record.utils.admin import get_admin


def _make_base_record(keys: AdministrationKeys, file_identifier: str) -> Record:
    """
    Generate a basic, open, metadata record complaint with MAGIC profiles.

    Uses the MAGIC open record preset provided by Lantern as a base, extended with other required properties that do
    not have static values, including placeholders for freetext properties and a simple default for edition.
    """
    record = RecordMagicOpen(
        file_identifier=file_identifier,
        hierarchy_level=HierarchyLevelCode.PRODUCT,
        identification=Identification(
            title="...",
            abstract="...",
            dates=Dates(creation=Date(date=datetime.now(tz=UTC))),
            edition="1",
            extents=Extents(
                [
                    Extent(
                        identifier="bounding",
                        geographic=ExtentGeographic(
                            bounding_box=BoundingBox(
                                west_longitude=0, east_longitude=0, south_latitude=0, north_latitude=0
                            )
                        ),
                    )
                ]
            ),
        ),
        data_quality=DataQuality(lineage=Lineage(statement="...")),
        admin_keys=keys,
        admin_meta=AdministrationMetadata(id=file_identifier),
    )
    # extend preset with opinionated defaults to comply with MAGIC discovery profile
    record.identification.maintenance.progress = ProgressCode.COMPLETED  # req. 11
    record.identification.maintenance.maintenance_frequency = MaintenanceFrequencyCode.AS_NEEDED  # req. 12

    return record


def init_record(admin_keys: AdministrationKeys) -> Record:
    """Initialise minimal metadata record."""
    file_identifier = str(uuid4())
    return _make_base_record(keys=admin_keys, file_identifier=file_identifier)


def get_record_admin(admin_keys: AdministrationKeys, record: Record) -> AdministrationMetadata | None:
    """Get administration metadata from record if defined."""
    return get_admin(keys=admin_keys, record=record)
