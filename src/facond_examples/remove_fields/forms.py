"""Demonstrate how to remove choices from ChoiceField."""

from django import forms

from facond import shortcuts as facond


class TestForm(facond.Form, forms.Form):
    """Add a rule on title, for action to remove itself depending on kind."""

    kind = forms.ChoiceField(choices=(
        ('nonprofit', 'nonprofit'),
        ('person', 'person'),
    ))
    title = forms.CharField()
    name = forms.CharField()

    facond_actions = [
        facond.RemoveField(
            [facond.ValueIs('kind', 'nonprofit')],
            'title',
        ),
    ]
