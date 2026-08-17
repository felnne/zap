from dataclasses import dataclass

import streamlit as st
from cattrs import ClassValidationError
from lantern.lib.metadata_library.models.record.record import Record, RecordInvalidError, RecordSchema
from lantern.models.record.record import Record as RecordCatalogue

from zap.sections.base import Section
from zap.utils import flatten_exceptions


@dataclass
class ValidationOutput:
    """Format record validation check for Streamlit."""

    domain: str
    status: bool
    message: str
    exception: BaseException | None = None

    def render(self) -> None:
        """Render validation check."""
        if self.status:
            st.success(self.message, icon="✅")
            return
        st.error(self.message, icon="❌")
        with st.expander(f"{self.domain} errors") as expander:
            if isinstance(self.exception, BaseExceptionGroup):
                for e in flatten_exceptions(self.exception):
                    expander.exception(e)
                return
            expander.exception(self.exception)
        return


class ToolValidate(Section):
    """Current record validation status."""

    @staticmethod
    def _validate_base(record: Record) -> ValidationOutput:
        """Validate against base (lib) record class."""
        _domain = "Base schema"
        try:
            record.validate(use_profiles=False)
            return ValidationOutput(domain=_domain, status=True, message="Record config is valid 🙂")
        except RecordInvalidError as e:
            return ValidationOutput(domain=_domain, status=False, message="Record config is invalid 😭", exception=e)

    @staticmethod
    def _validate_lantern(record: Record) -> ValidationOutput:
        """Validate against catalogue record class."""
        _domain = "Lantern 🏮 catalogue requirements"
        _link = "[Lantern 🏮 Catalogue Requirements](https://github.com/antarctica/lantern/blob/main/docs/models.md#record-requirements)"

        try:
            cat_record = RecordCatalogue.loads(record.dumps(strip_admin=False))
        except ClassValidationError as e_group:
            return ValidationOutput(
                domain=_domain,
                status=False,
                message="Record cannot be parsed as a catalogue record and cannot be validated further 😵",
                exception=e_group,
            )
        try:
            cat_record.validate(use_profiles=False)
            return ValidationOutput(domain=_domain, status=True, message=f"Record config meets {_link} 😀")
        except RecordInvalidError as e:
            return ValidationOutput(
                domain=_domain, status=False, message=f"Record config does not meet {_link} 😰", exception=e
            )

    @staticmethod
    def _validate_discovery(record: Record) -> ValidationOutput:
        """Validate against MAGIC discovery profile."""
        _domain = "MAGIC Discovery Profile"
        _link = "[MAGIC Discovery Profile](https://metadata-standards.data.bas.ac.uk/profiles/magic-discovery/v2)"

        try:
            record.validate(force_schemas=[RecordSchema.MAGIC_DISCO_V2])
            return ValidationOutput(domain=_domain, status=True, message=f"Record config meets the {_link} 🤩")
        except RecordInvalidError as e:
            return ValidationOutput(
                domain=_domain, status=False, message=f"Record config does not meet the {_link} 😞", exception=e
            )

    @staticmethod
    def _validate_admin(record: Record) -> ValidationOutput:
        """Validate against MAGIC administration profile."""
        _domain = "MAGIC Administration Profile"
        _link = "[MAGIC Administration Profile](https://metadata-standards.data.bas.ac.uk/profiles/magic-administration/v1/)"

        try:
            record.validate(force_schemas=[RecordSchema.MAGIC_ADMIN_V1])
            return ValidationOutput(domain=_domain, status=True, message=f"Record config meets the {_link} 🥳")
        except RecordInvalidError as e:
            return ValidationOutput(
                domain=_domain, status=False, message=f"Record config does not meet the {_link} 😰", exception=e
            )

    def render(self) -> None:
        """Render."""
        st.header("Record validation")

        record = st.session_state.get("record", None)
        if not isinstance(record, Record):
            st.info("Set record to enable validation.", icon="ℹ️")  # noqa: RUF001
            return

        base = self._validate_base(record)
        base.render()
        if not base.status:
            return

        lantern = self._validate_lantern(record)
        lantern.render()

        discovery = self._validate_discovery(record)
        discovery.render()

        admin = self._validate_admin(record)
        admin.render()
