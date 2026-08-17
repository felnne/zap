import pytest
from lantern.lib.metadata_library.models.record.elements.common import Identifiers
from lantern.lib.metadata_library.models.record.record import Record
from streamlit.testing.v1 import AppTest

from zap.sections.tool_validate import ToolValidate, ValidationOutput


class TestValidationOutput:
    """Test validation check output formatting."""

    @staticmethod
    def _app_script(output: ValidationOutput) -> None:
        from zap.sections.tool_validate import ValidationOutput  # noqa: F401

        output.render()

    @pytest.mark.parametrize(
        "output",
        [
            ValidationOutput(domain="x", status=True, message="x"),
            ValidationOutput(domain="x", status=False, message="x", exception=ValueError("x")),
            ValidationOutput(
                domain="x",
                status=False,
                message="x",
                exception=BaseExceptionGroup("x", [ValueError("y"), ValueError("z")]),
            ),
        ],
    )
    def test_render(self, output: ValidationOutput):
        """Can render validation output."""
        at = AppTest.from_function(self._app_script, kwargs={"output": output})
        at.run()

        if output.status:
            assert at.success[0].value == output.message
            assert len(at.error) == 0
            assert len(at.exception) == 0
        else:
            assert at.error[0].value == output.message
            assert len(at.success) == 0
            if isinstance(output.exception, BaseExceptionGroup):
                assert len(at.exception) == len(output.exception.exceptions)
            else:
                assert len(at.exception) == 1


class TestValidateSectionLogic:
    """Test validation tool logic."""

    @pytest.mark.parametrize(("state", "status"), [("valid", True), ("invalid", False)])
    def test_validate_base(self, fx_record_config_iso_minish: dict, state: str, status: bool):
        """Can validate a record against base schema."""
        record = Record.loads(fx_record_config_iso_minish)
        if not status:
            record.identification.title = None
        result = ToolValidate._validate_base(record)
        assert isinstance(result, ValidationOutput)
        assert result.status == status

    @pytest.mark.parametrize(("state", "status"), [("error", False), ("valid", True), ("invalid", False)])
    def test_validate_lantern(self, fx_record_config_cat_min: dict, state: str, status: bool):
        """
        Can validate a record against catalogue requirements.

        Also handles where a record can't be loaded as a catalogue record due to properties which are optional in base
        records but required in catalogue records being missing (e.g. file_identifier), triggering a load error.
        """
        record = Record.loads(fx_record_config_cat_min)
        expected_error = "Record config does not meet [Lantern 🏮 Catalogue Requirements](https://github.com/antarctica/lantern/blob/main/docs/models.md#record-requirements) 😰"
        if not status:
            record.identification.identifiers = Identifiers([])
        if state == "error":
            record.file_identifier = None
            expected_error = "Record cannot be parsed as a catalogue record and cannot be validated further 😵"

        result = ToolValidate._validate_lantern(record)
        assert isinstance(result, ValidationOutput)
        assert result.status == status
        if not status:
            assert result.message == expected_error

    @pytest.mark.parametrize(("state", "status"), [("valid", True), ("invalid", False)])
    def test_validate_discovery(self, fx_record_config_magic: dict, state: str, status: bool):
        """Can validate a record against MAGIC discovery profile."""
        record = Record.loads(fx_record_config_magic)
        if not status:
            record.identification.edition = None
        result = ToolValidate._validate_discovery(record)
        assert isinstance(result, ValidationOutput)
        assert result.status == status

    @pytest.mark.parametrize(("state", "status"), [("valid", True), ("invalid", False)])
    def test_validate_admin(self, fx_record_config_magic: dict, state: str, status: bool):
        """Can validate a record against MAGIC administration profile."""
        record = Record.loads(fx_record_config_magic)
        if not status:
            record.identification.supplemental_information = None
        result = ToolValidate._validate_admin(record)
        assert isinstance(result, ValidationOutput)
        assert result.status == status


class TestValidateSectionUI:
    """Test validation tool UI."""

    @staticmethod
    def _app_script() -> None:
        from zap.sections.tool_validate import ToolValidate

        section = ToolValidate()
        section.render()

    def test_render(self):
        """Can render section."""
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert at.header[0].body == "Record validation"

    @pytest.mark.cov()
    @pytest.mark.parametrize("value", [None, "x"])
    def test_empty(self, value: str | None):
        """
        Cannot validate without a current record.

        This includes a non-Record value.
        """
        at = AppTest.from_function(self._app_script)
        at.session_state.record = value
        at.run()

        assert not at.exception
        assert at.info[0].value == "Set record to enable validation."
        # should have no other output
        assert len(at.success) == 0
        assert len(at.error) == 0
        assert len(at.exception) == 0

    @pytest.mark.parametrize("state", ["all-invalid", "all-valid"])
    def test_validation(self, fx_record_config_iso_minish: dict, fx_record_config_magic: dict, state: str):
        """
        Can show correct state depending on current record.

        Acts as an integration test for all checks. An invalid ISO record should stop further validation.
        """
        config = fx_record_config_iso_minish if "iso" in state else fx_record_config_magic
        record = Record.loads(config)
        if state == "all-invalid":
            record.identification.title = None

        at = AppTest.from_function(self._app_script)
        at.session_state.record = record
        at.run()

        assert len(at.info) == 0
        if state == "all-invalid":
            assert at.error[0].value == "Record config is invalid 😭"
            # should have no other output
            assert len(at.error) == 1
            assert len(at.exception) == 1
            assert len(at.success) == 0
        elif state == "all-valid":
            assert at.success[0].value == "Record config is valid 🙂"
            assert (
                at.success[1].value
                == "Record config meets [Lantern 🏮 Catalogue Requirements](https://github.com/antarctica/lantern/blob/main/docs/models.md#record-requirements) 😀"
            )
            assert (
                at.success[2].value
                == "Record config meets the [MAGIC Discovery Profile](https://metadata-standards.data.bas.ac.uk/profiles/magic-discovery/v2) 🤩"
            )
            assert (
                at.success[3].value
                == "Record config meets the [MAGIC Administration Profile](https://metadata-standards.data.bas.ac.uk/profiles/magic-administration/v1/) 🥳"
            )

            assert len(at.error) == 0
            assert len(at.exception) == 0
            assert len(at.success) == 4  # noqa: PLR2004
