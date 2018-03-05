# flake8: noqa: F401,I202
"""Shortcuts, use: `from ddf import shortcuts as ddf` to feel awesome."""

from .actions import (
    Action,
    Remove,
    RemoveChoices,
)

from .conditions import (
    Condition,
    ValueIs,
)

from .forms import (
    FormMixin,
    ScriptField,
    ScriptWidget,
)
