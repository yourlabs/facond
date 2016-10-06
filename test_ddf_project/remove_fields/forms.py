from ddf import shortcuts as ddf

from django import forms


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
