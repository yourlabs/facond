"""Actions on form."""
from collections import OrderedDict

from django import forms

from .js import JsDictMixin


class Action(JsDictMixin):
    """An action to take on a list of fields."""
    js_attrs = ['conditions']

    def __init__(self, *conditions):
        """Instanciate with a list of condition to require."""
        self.conditions = conditions

    def execute(self, field):
        """Prevent the action from being applied if conditions don't pass."""
        for condition in self.conditions:
            if not condition.validate(field.form):
                return

        self.apply(field)
        return self

    def apply(self, field):
        """Actual application of the action on the form field."""
        raise NotImplemented()

    def unapply(self, form):
        """Revert apply() action."""


class Remove(Action):
    """Remove fields from a form."""

    def apply(self, field):
        """Remove the field and data from field.form."""
        self.original_keys = list(field.form.fields.keys())
        self.original_field = field.form.fields.pop(field.name)
        attr = self.original_field.widget.attrs.get('class', '')
        attr += ' ddf-hide'
        self.original_field.widget.attrs['class'] = attr

    def unapply(self, form):
        """Restore the field and data in field.form."""
        original_field = getattr(self, 'original_field', None)
        if not original_field:
            return
        fields = OrderedDict()
        for key in self.original_keys:
            if key == original_field.name:
                fields[key] = original_field
            elif key in form.fields:
                fields[key] = form.fields[key]
        form.fields = fields


class RemoveChoices(Action):
    """Remove choices from a choice field."""
    js_attrs = ['conditions', 'choices']

    def __init__(self, choices, *conditions):
        """List of choice values to remove if conditions pass."""
        self.choices = choices
        super(RemoveChoices, self).__init__(*conditions)

    def apply(self, field):
        """Raise a ValidationError if the field value is in self.values."""
        value = field.form.data.get(field.name, None)
        if value in self.choices:
            raise forms.ValidationError(
                field.error_messages['invalid_choice'],
                code='invalid_choice',
                params={'value': value},
            )
