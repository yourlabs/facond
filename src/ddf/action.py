"""Actions on form."""

from django import forms

from .base import DictMixin


class Action(DictMixin):
    """An action to take on a list of fields."""

    def __init__(self, *conditions):
        """An action takes a list of condition to require."""
        self.conditions = conditions

    def execute(self, form, field):
        """Prevent the action from being applied if conditions don't pass."""
        for condition in self.conditions:
            if not condition.validate(form):
                return

        self.apply(form, field)

    def apply(self, form, field):
        """Actual application of the action on the form field."""
        raise NotImplemented()


class Remove(Action):
    """Remove fields from a form."""

    def apply(self, form, field):
        """Remove the field and data."""
        form.fields.pop(field)

        if field in form.data:
            form.data.pop(field)


class RemoveChoices(Action):
    """Remove choices from a choice field."""

    def __init__(self, choices, *conditions):
        """List of choice values to remove if conditions pass."""
        self.choices = choices
        super(RemoveChoices, self).__init__(*conditions)

    def apply(self, form, field):
        """Raise a ValidationError if the field value is in self.values."""
        value = form.data.get(field, None)
        if value in self.choices:
            raise forms.ValidationError(
                form.fields[field].error_messages['invalid_choice'],
                code='invalid_choice',
                params={'value': value},
            )
