from streamlit.testing.v1 import AppTest


class TestIntoSection:
    """Test intro section."""

    @staticmethod
    def _app_script() -> None:
        from zap.sections.intro import IntroSection

        section = IntroSection()
        section.render()

    def test_render(self):
        """Can render section."""
        at = AppTest.from_function(self._app_script)
        at.run()
        assert not at.exception
        assert at.title[0].body == "⚡️Zap II"
