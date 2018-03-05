"""Conditions for Actions."""

from .js import JsDictMixin


class Condition(JsDictMixin):
    """Base condition."""

    def validate(self, form):
        """Return True if the form passes this condition."""


class ValueEqual(Condition):
    """Rule that passes if a field has an arbitrary value."""

    def __init__(self, field, value):
        """Require a field to have a value."""
        self.field = field
        self.value = value

    def validate(self, form):
        """Return True if the form field has the given value."""
        return form.data.get(self.field, None) == self.value
