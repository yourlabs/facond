from .base import DictMixin


class Condition(DictMixin):
    """Base condition."""


class ValueIs(Condition):
    """Rule that passes if a field has an arbitrary value."""

    def __init__(self, field, value):
        self.field = field
        self.value = value

    def validate(self, form):
        return form.data.get(self.field, None) == self.value
