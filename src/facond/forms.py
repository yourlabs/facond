"""
Form objects are what Action and Conditions use.

A Form has a list of :doc:`actions` to apply and unapply.

See respective documentations for more information about what this does client
and server side.
"""

import json

from django import forms
from django.utils.safestring import mark_safe

from .js import JsDictMixin


class BoundField(forms.BoundField):
    """BoundField override for facond Form."""

    def css_classes(self):
        """Allow setting extra_css_classes."""
        return super(BoundField, self).css_classes(
            getattr(self, 'extra_css_classes', ''))


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

    def render(self, name, value, attrs=None, renderer=None):
        """Render a script tag with JSON configuration."""
        return mark_safe(''.join((
            '<script type="text/facond-configuration">',
            json.dumps(self.data),
            '</script>',
            # Try to save the day if someone doesn't use _html_ouput
            # If not enough for you (Django insists in rendering hidden fields
            # at the end of the form), then you've got to set this earlier than
            # form rendering yourself (see FAQ).
            '<style type="text/css">',
            '.facond-hide { display: none; }',
            '</style>',
        )))

    def is_hidden(self):
        """Don't render no field container nor label."""
        return True


class Form(JsDictMixin):
    """
    Mixin to enable :doc:`actions` on your Django form.

    To use it, just add it to your form's parents, and then set the list of
    :py:class:`~facond.actions.Action` in :py:attr:`facond_actions`, ie.::

        class YourForm(facond.Form, forms.Form):
            facond_actions = [
                # remove field lol if field f's value equals 'v'
                facond.RemoveField([facond.ValueEqual('f', 'v')], 'lol')
            ]

    Under the hood, it takes several actions:

    - define a media to load facond.js, the script we build,
    - transparently add a :py:class:`ScriptField` to the form,
    - more action in :py:meth:`full_clean`
    - override _html_output() so that we have a .facond-hide CSS style before
      form renders, to prevent flashing of fields that would be hidden by JS on
      first update. That might not work ie. with django-material which doesn't
      use any of Django's supported rendering mechanisms.

    Funny side note: this even makes form field hide/show to work

    .. py:attribute:: facond_actions

        This is the attribute which should contain the list of
        :py:class:`facond.actions.Action` for this form.

    .. py:attribute:: facond_field_name

        Name of the :py:class:`ScriptField` to add to the form. That field will
        contain the JSON dict of the form, as returned by :py:meth:`js_dict`.

    .. py:attribute:: js_class

        Is equal to ``facond.forms.Form`` by default, which maps to the default
        :js:class:`Form` class, but which you can override, if you're into
        "overriding the JS class for this form".
    """

    facond_field_name = 'facond_script'
    js_class = 'facond.forms.Form'

    class Media:
        """Load our built JS."""

        js = ['facond.js']

    def __init__(self, *args, **kwargs):
        """
        Add the :py:class:`ScriptField` with our configuration.

        Also, this replaces Django's BoundField by
        :py:class:`facond.forms.BoundField`.
        """
        super(Form, self).__init__(*args, **kwargs)
        self.fields[self.facond_field_name] = ScriptField(self.js_dict())

        for name, field in self.fields.items():
            self._bound_fields_cache[name] = BoundField(self, field, name)

    def _html_output(self, *args, **kwargs):
        """Render .facond-hide CSS style before the form to prevent flash."""
        return mark_safe('\n'.join((
            '<style type="text/css">.facond-hide {display:none;}</style>',
            super(Form, self)._html_output(*args, **kwargs),
        )))

    def full_clean(self):
        """
        Apply each rule during validation, and then unapply them.
        """
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
