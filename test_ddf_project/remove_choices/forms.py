from django import forms

from ddf import shortcuts as ddf


class TestForm(ddf.FormMixin, forms.Form):
    platform = forms.ChoiceField(choices=(
        ('Linux', 'Linux'),
        ('Windows', 'Windows'),
    ))
    service = forms.ChoiceField(choices=(
        ('Format', 'Format'),
        ('Support', 'Support')
    ))

    _ddf = dict(
        service=[
            ddf.RemoveChoices(
                ['Support'],
                ddf.ValueIs('platform', 'Windows'),
            )
        ]
    )
