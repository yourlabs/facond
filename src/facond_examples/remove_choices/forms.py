"""Demonstrate how to remove choices from select."""

from django import forms

from facond import shortcuts as facond


class TestForm(facond.Form, forms.Form):
    """Remove the Support option for windows, sorry :)."""

    platform = forms.ChoiceField(choices=(
        ('Linux', 'Linux'),
        ('Windows', 'Windows'),
    ))
    service = forms.ChoiceField(choices=(
        ('Support', 'Support'),
        ('Format', 'Format'),
    ))

    facond = facond.ScriptField([
        facond.RemoveChoices(
            [facond.ValueIs('platform', 'Windows')],
            'service',
            ['Support'],
        )
    ])
