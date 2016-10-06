import json
import re

from django import forms
from django.utils.safestring import mark_safe

from .rule import Rule


class Field(forms.Field):
    def __init__(self, name=None, **fields):
        self.rules = []
        self.name = name or 'ddf'

        for field, actions in fields.items():
            self.rules.append(Rule(field, actions))

        super(Field, self).__init__(
            required=False,
            widget=Widget(self),
        )


class Widget(forms.Widget):
    class Media:
        js = (
            'ddf/ddf.js',
        )

    def __init__(self, field):
        super(Widget, self).__init__()
        self.field = field

    def render(self, name, value, attrs=None):
        m = re.match(r'([^-]+-\d-)', name)
        prefix = m.group() if m else None

        return mark_safe(''.join((
            '<script type="text/ddf-configuration">',
            json.dumps(dict(
                cls='ddf.form.Form',
                prefix=prefix,
                rules=[r.dict() for r in self.field.rules],
            )),
            '</script>',
        )))

    def is_hidden(self):
        return True


class FormMixin(object):
    def __init__(self, *args, **kwargs):
        super(FormMixin, self).__init__(*args, **kwargs)
        self.fields['django_dynamic_fields'] = Field(**self._ddf)

    def full_clean(self):
        for rule in self.fields['django_dynamic_fields'].rules:
            rule.apply(self)
        return super(FormMixin, self).full_clean()
