"""
An Action may apply reversible mutations on :doc:`Form<forms>`.

It should always take a list of :doc:`Condition<conditions>` as first
argument, and then whatever it's going to need to work.

On the server side,
"""
from collections import OrderedDict

from django import forms

from .js import JsDictMixin


class Action(JsDictMixin):
    """An action with an optional list of :py:cls:`~facond.forms.Form`.

    The :py:meth:`~execute()` will first execute
    :py:meth:`~facond.conditions.Condition.validate()` for every of its
    conditions against the :py:cls:`~facond.forms.Form` instance it is passed.
    """

    js_attrs = ['field', 'conditions']

    def __init__(self, conditions):
        """Instanciate with a list of condition to require."""
        self.conditions = conditions

    def execute(self, form):
        """Prevent the action from being applied if conditions don't pass."""
        for condition in self.conditions:
            if not condition.validate(form):
                return

        self.apply(form)
        return self

    def apply(self, form):
        """Actual application of the action on the form field."""
        raise NotImplementedError()

    def unapply(self, form):
        """Revert apply() action."""


class RemoveField(Action):
    """Remove fields from a form."""

    def __init__(self, conditions, field):
        """Remove a field if conditions validate."""
        super(RemoveField, self).__init__(conditions)
        self.field = field

    def apply(self, form):
        """Remove the field and data from field.form."""
        form[self.field].extra_css_classes = 'facond-hide'
        self.original_keys = list(form.fields.keys())
        self.original_field = form.fields.pop(self.field)

    def unapply(self, form):
        """Restore the field and data in field.form."""
        original_field = getattr(self, 'original_field', None)
        if not original_field:
            return
        fields = OrderedDict()
        for key in self.original_keys:
            if key == self.field:
                fields[key] = original_field
            elif key in form.fields:
                fields[key] = form.fields[key]
        form.fields = fields


class ChoicesAction(Action):
    js_attrs = ['field', 'choices', 'conditions']

    def __init__(self, conditions, field, choices):
        """List of choice values to remove if conditions pass."""
        super().__init__(conditions)
        self.field = field
        self.choices = choices

    def apply(self, form):
        """Raise a ValidationError if the field value is in self.values."""
        values = form.data.get(self.field, None)
        if not isinstance(values, list):
            values = [values]

        for value in values:
            if not self.validate(value):
                raise forms.ValidationError(
                    form.fields[self.field].error_messages['invalid_choice'],
                    code='invalid_choice',
                    params={'value': value},
                )


class RemoveChoices(ChoicesAction):
    """Remove choices from a choice field."""

    def validate(self, value):
        return value not in self.choices


class SetChoices(ChoicesAction):
    """Remove choices from a choice field."""

    def validate(self, value):
        return value in self.choices
