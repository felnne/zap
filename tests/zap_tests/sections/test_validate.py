import pytest
from lantern.lib.metadata_library.models.record.elements.common import Identifiers
from lantern.lib.metadata_library.models.record.record import Record
from streamlit.testing.v1 import AppTest


class TestValidateSection:
    """Test validation tool section."""

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
        assert at.info[0].value == "Set record config to enable validation."
        # should have no other output
        assert len(at.success) == 0
        assert len(at.error) == 0
        assert len(at.exception) == 0

    @pytest.mark.parametrize(
        "state", ["invalid-iso", "valid-iso", "invalid-cat", "valid-cat", "invalid-magic", "valid-magic"]
    )
    def test_validation(
        self, fx_record_config_iso_min: dict, fx_record_config_cat_min: dict, fx_record_config_magic: dict, state: str
    ):
        """Can show correct state depending on current record."""
        config = fx_record_config_iso_min if "iso" in state else fx_record_config_cat_min
        config = fx_record_config_magic if "magic" in state else config
        record = Record.loads(config)
        # remove required properties if needed
        if state == "invalid-iso":
            record.identification.title = None
        if state == "invalid-cat":
            record.identification.identifiers = Identifiers([])
        if state == "invalid-magic":
            record.identification.supplemental_information = None

        at = AppTest.from_function(self._app_script)
        at.session_state.record = record
        at.run()

        assert len(at.info) == 0
        if state == "invalid-iso":
            assert at.error[0].value == "Record config is invalid 😞"
            # should have no other output
            assert len(at.error) == 1
            assert len(at.exception) == 1
            assert len(at.success) == 0
        elif state == "valid-iso":
            assert at.success[0].value == "Record config is valid 🙂"
            # should still fail catalogue and profile validation
            assert len(at.error) > 0
            assert len(at.exception) > 0
            assert len(at.success) == 1
        elif state == "invalid-cat":
            assert at.error[0].value == "Record config does not meet catalogue requirements 😢"
            assert len(at.exception) > 0
            # should still pass ISO validation
            assert len(at.success) == 1
        elif state == "valid-cat":
            assert at.success[0].value == "Record config is valid 🙂"
            assert at.success[1].value == "Record config meets catalogue requirements 😀"
            # should still fail profile validation
            assert len(at.error) > 0
            assert len(at.exception) > 0
            assert len(at.success) == 2  # noqa: PLR2004
        elif state == "invalid-magic":
            assert at.error[0].value == "Record config does not meet MAGIC profile requirements 😭"
            assert len(at.exception) > 0
            # should still pass ISO and catalogue validation
            assert len(at.success) == 2  # noqa: PLR2004
        elif state == "valid-cat":
            assert at.success[0].value == "Record config is valid 🙂"
            assert at.success[1].value == "Record config meets catalogue requirements 😀"
            assert at.success[2].value == "Record config meets MAGIC profile requirements 🥳"
            assert len(at.error) == 0
            assert len(at.exception) == 0
            assert len(at.success) == 3  # noqa: PLR2004
