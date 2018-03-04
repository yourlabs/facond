"""Demonstrate how to remove choices from ChoiceField."""

from ddf import shortcuts as ddf

from django import forms


class TestForm(ddf.FormMixin, forms.Form):
    """Add a rule on title, for action to remove itself depending on kind."""

    kind = forms.ChoiceField(choices=(
        ('nonprofit', 'nonprofit'),
        ('person', 'person'),
    ))
    title = forms.CharField()
    name = forms.CharField()

    _ddf = dict(
        title=[
            ddf.Remove(
                ddf.ValueIs('kind', 'nonprofit'),
            ),
        ],
    )
