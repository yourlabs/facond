"""Form configuration and entry point."""

import json
import re

from django import forms
from django.utils.safestring import mark_safe

from .rule import Rule


class Field(forms.Field):
    """Field to render the JSON configuration and figure the form prefix."""

    def __init__(self, **fields):
        """Given a dict of fields with action lists, prepare the JSON."""
        self.rules = []

        for field, actions in fields.items():
            self.rules.append(Rule(field, actions))

        super(Field, self).__init__(
            required=False,
            widget=Widget(self),
        )


class Widget(forms.Widget):
    """JSON rendering."""

    class Media:
        """Load ddf javascript."""

        js = (
            'ddf/ddf.js',
        )

    def __init__(self, field):
        """Take the field which has the rules to render."""
        super(Widget, self).__init__()
        self.field = field

    def render(self, name, value, attrs=None):
        """Render a script tag with JSON configuration."""
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
        """Don't render no field container nor label."""
        return True


class FormMixin(object):
    """Hook into full_clean to apply rules before full_clean."""

    def __init__(self, *args, **kwargs):
        """Add a Field with the configuration."""
        super(FormMixin, self).__init__(*args, **kwargs)
        self.fields['django_dynamic_fields'] = Field(**self._ddf)

    def full_clean(self):
        """Apply each rule before super."""
        for rule in self.fields['django_dynamic_fields'].rules:
            rule.apply(self)
        return super(FormMixin, self).full_clean()
