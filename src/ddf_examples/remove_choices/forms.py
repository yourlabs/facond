"""Demonstrate how to remove choices from select."""
from ddf import shortcuts as ddf

from django import forms


class TestForm(ddf.FormMixin, forms.Form):
    """Remove the Support option for windows, sorry :)."""

    platform = forms.ChoiceField(choices=(
        ('Linux', 'Linux'),
        ('Windows', 'Windows'),
    ))
    service = forms.ChoiceField(choices=(
        ('Support', 'Support'),
        ('Format', 'Format'),
    ))

    _ddf = dict(
        service=[
            ddf.RemoveChoices(
                ['Support'],
                ddf.ValueIs('platform', 'Windows'),
            )
        ]
    )
