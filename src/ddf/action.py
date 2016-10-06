from django import forms

from .base import DictMixin


class Action(DictMixin):
    """An action to take on a list of fields."""

    def __init__(self, *conditions):
        self.conditions = conditions

    def execute(self, form, field):
        for condition in self.conditions:
            if not condition.validate(form):
                return

        self.apply(form, field)

    def apply(self, form, field):
        raise NotImplemented()


class Remove(Action):
    """Remove fields from a form."""

    def apply(self, form, field):
        form.fields.pop(field)

        if field in form.data:
            form.data.pop(field)


class RemoveChoices(Action):
    def __init__(self, choices, *conditions):
        self.choices = choices
        super(RemoveChoices, self).__init__(*conditions)

    def apply(self, form, field):
        value = form.data.get(field, None)
        if value in self.choices:
            raise forms.ValidationError(
                form.fields[field].error_messages['invalid_choice'],
                code='invalid_choice',
                params={'value': value},
            )
