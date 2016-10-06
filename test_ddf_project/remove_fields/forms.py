from django import forms

from ddf import shortcuts as ddf


class TestForm(ddf.FormMixin, forms.Form):
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
