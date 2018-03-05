"""Demonstrate how to remove choices from ChoiceField."""

from django import forms

from facond import shortcuts as facond


class TestForm(facond.FormMixin, forms.Form):
    """Add a rule on title, for action to remove itself depending on kind."""

    kind = forms.ChoiceField(choices=(
        ('nonprofit', 'nonprofit'),
        ('person', 'person'),
    ))
    title = forms.CharField()
    name = forms.CharField()

    facond = facond.ScriptField([
        facond.RemoveField(
            'title',
            facond.ValueIs('kind', 'nonprofit'),
        ),
    ])
