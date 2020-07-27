# flake8: noqa: F401,I202
"""Shortcuts, use: `from facond import shortcuts as facond` to feel awesome."""

from .actions import (
    Action,
    ChoicesAction,
    RemoveChoices,
    SetChoices,
    RemoveField,
)

from .conditions import (
    Condition,
    ValueEqual,
)

from .forms import (
    Form,
    ScriptField,
    ScriptWidget,
)
