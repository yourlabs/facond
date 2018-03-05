"""Demonstrate how to remove choices from multiple select."""

from facond import shortcuts as facond

from django import forms


class TestForm(facond.FormMixin, forms.Form):
    """Remove the Support option for windows, sorry :)."""

    platform = forms.ChoiceField(choices=(
        ('Linux', 'Linux'),
        ('Windows', 'Windows'),
    ))
    service = forms.MultipleChoiceField(choices=(
        ('Support', 'Support'),
        ('Format', 'Format'),
    ))

    facond = facond.ScriptField([
        facond.RemoveChoices(
            'service',
            ['Support'],
            facond.ValueIs('platform', 'Windows'),
        )
    ])
