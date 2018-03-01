"""
Form objects are what the Action and Condition use.

Action objects have ``execute(form)`` against Form objects, and Condition
objects have ``validate(form)`` to validate against a Form.

See respective documentations for more information about what this does client
and server side.
"""

import json

from django import forms
from django.utils.safestring import mark_safe

from .js import JsDictMixin


class ScriptField(forms.Field):
    """Field to render the JSON configuration and figure the form prefix."""

    def __init__(self, data):
        """Output a JSON script tag for data."""
        super(ScriptField, self).__init__(
            required=False,
            widget=ScriptWidget(data),
        )


class ScriptWidget(forms.Widget):
    """JSON rendering."""

    def __init__(self, data):
        """Take the field which has the actions to render."""
        super(ScriptWidget, self).__init__()
        self.data = data

    def render(self, name, value, attrs=None):
        """Render a script tag with JSON configuration."""
        return mark_safe(''.join((
            '<script type="text/facond-configuration">',
            json.dumps(self.data),
            '</script>',
        )))

    def is_hidden(self):
        """Don't render no field container nor label."""
        return True


class Form(JsDictMixin):
    """Hook into full_clean to apply rules before full_clean."""

    facond_field_name = 'facond_script'
    js_class = 'facond.forms.Form'

    class Media:
        """Load our built JS."""

        js = ['facond.js']

    def __init__(self, *args, **kwargs):
        """Add a Field with the configuration and set field.form."""
        super(Form, self).__init__(*args, **kwargs)
        self.fields[self.facond_field_name] = ScriptField(self.js_dict())

    def full_clean(self):
        """Apply each rule during validation, and then unapply them."""
        applied = []
        for action in self.facond_actions:
            if action.execute(self):
                applied.append(action)

        facond = self.fields.pop(self.facond_field_name)
        result = super(Form, self).full_clean()
        self.fields[self.facond_field_name] = facond

        for action in applied:
            action.unapply(self)

        return result

    def js_dict(self):
        """Craft a simple JS dict for this complex Python object."""
        return dict(
            cls=self.js_class,
            prefix=self.prefix,
            actions=[action.js_dict() for action in self.facond_actions],
            # Let's have something basic for now, and build empirically in TDD
            # from here :)
            fields={
                name: dict(
                    cls=getattr(field, 'js_class', 'facond.forms.Field'),
                    name=name,
                )
                for name, field in self.fields.items()
                if name != self.facond_field_name
            }
        )
