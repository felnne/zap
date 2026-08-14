from abc import ABC, abstractmethod


class Section(ABC):
    """Base editor section."""

    @abstractmethod
    def render(self) -> None:
        """Render section."""
        ...
