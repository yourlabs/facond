"""Form configuration and entry point."""

import json
import re

from django import forms
from django.utils.safestring import mark_safe

from .js import JsDictMixin
from .rule import Rule


class ScriptField(forms.Field):
    """Field to render the JSON configuration and figure the form prefix."""

    def __init__(self, form):
        """Given a dict of fields with action lists, prepare the JSON."""
        self.form = form
        self.rules = []

        for field, actions in form._ddf.items():
            self.rules.append(Rule(field, actions))

        super(ScriptField, self).__init__(
            required=False,
            widget=ScriptWidget(self),
        )

        # i do this everytime i create something with django forms
        # perhaps it's time to give djnago forms a redesign ...
        self.widget.field = self


class ScriptWidget(forms.Widget):
    """JSON rendering."""

    class Media:
        """Load ddf javascript."""

        js = (
            'ddf/ddf.js',
        )

    def __init__(self, field):
        """Take the field which has the rules to render."""
        super(ScriptWidget, self).__init__()
        self.field = field

    def render(self, name, value, attrs=None):
        """Render a script tag with JSON configuration."""
        m = re.match(r'([^-]+-\d-)', name)
        prefix = m.group() if m else None

        return mark_safe(''.join((
            '<script type="text/ddf-configuration">',
            json.dumps(self.field.form.js_dict()),
            '</script>',
        )))

    def is_hidden(self):
        """Don't render no field container nor label."""
        return True


class FormMixin(JsDictMixin):
    """Hook into full_clean to apply rules before full_clean."""
    js_class = 'ddf.form.Form'

    def __init__(self, *args, **kwargs):
        """Add a Field with the configuration and set field.form."""
        super(FormMixin, self).__init__(*args, **kwargs)

        self.fields['django_dynamic_fields'] = ScriptField(self)

        for name, field in self.fields.items():
            field.form = self
            field.name = name

    def full_clean(self):
        """Apply each rule before super."""
        for rule in self.ddf_rules():
            rule.apply(self)
        return super(FormMixin, self).full_clean()

    def js_dict(self):
        """Craft a simple JS dict for this complex Python object."""
        return dict(
            cls='ddf.form.Form',
            prefix=self.prefix,
            rules=[r.js_dict() for r in self.ddf_rules()],
            fields={
                name: dict(
                    cls=getattr(field, 'js_class', 'ddf.form.Field'),
                    name=name,
                )
                for name, field in self.fields.items()
                if name != 'django_dynamic_fields'
            }
        )

    def ddf_rules(self):
        """Return the list of Rule instances reversed from self._ddf."""
        return [
            Rule(field, actions)
            for field, actions in self._ddf.items()
        ]
