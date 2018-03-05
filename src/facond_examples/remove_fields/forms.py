"""Demonstrate how to remove choices from ChoiceField."""

from facond import shortcuts as facond

from django import forms


class TestForm(facond.FormMixin, forms.Form):
    """Add a rule on title, for action to remove itself depending on kind."""

    kind = forms.ChoiceField(choices=(
        ('nonprofit', 'nonprofit'),
        ('person', 'person'),
    ))
    title = forms.CharField()
    name = forms.CharField()

    facond = facond.ScriptField([
        facond.Remove(
            'title',
            facond.ValueIs('kind', 'nonprofit'),
        ),
    ])
