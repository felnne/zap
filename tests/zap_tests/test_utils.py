import pytest

from zap.utils import flatten_exceptions, load_secrets


class ExampleError(Exception):
    """For test_flatten_exceptions."""


class TestUtils:
    """Test general utilities."""

    def test_load_secrets(self):
        """
        Can load config values from environment variables or .env file for setting Streamlit secrets.

        Known coverage gap for loading from .env file.
        """
        result = load_secrets()
        assert isinstance(result, dict)
        assert result["admin_metadata"]["encryption_key_private"] is not None
        assert result["admin_metadata"]["signing_key_private"] is not None
        assert result["non_sensitive"] == {}

    @pytest.mark.parametrize(
        ("value", "expected"),
        [
            (ExampleError("x"), [ExampleError("x")]),
            (
                BaseExceptionGroup(
                    "level1",
                    [
                        BaseExceptionGroup(
                            "level2", [BaseExceptionGroup("level3", [ExampleError("x"), ExampleError("y")])]
                        )
                    ],
                ),
                [ExampleError("x"), ExampleError("y")],
            ),
        ],
    )
    def test_flatten_exceptions(self, value: BaseException, expected: list[BaseException]):
        """
        Can flatten nested exceptions if needed.

        Exceptions compaire by identity so more verbose logic is needed.
        """
        result = flatten_exceptions(value)
        assert len(result) == len(expected)
        for res_exc, exp_exc in zip(result, expected, strict=False):
            assert type(res_exc) is type(exp_exc)
            assert res_exc.args == exp_exc.args
