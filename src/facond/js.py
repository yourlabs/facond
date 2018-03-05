"""Export Python objects to JavaScript."""


class JsDictMixin(object):
    """Make dicts to export in JSON, and facond.instanciate() in JS."""

    @property
    def js_class(self):
        """Return the path to the javascript class."""
        return '%s.%s' % (type(self).__module__, type(self).__name__)

    @property
    def js_attrs(self):
        """Return the list of attributes to export in js_dict()."""
        return self.__dict__.keys()

    def js_dict_items(self):
        """Yield items for the JS dict."""
        for key, value in self.__dict__.items():
            if key in self.js_attrs:
                yield key, value

    def js_dict(self):
        """Return what the JS will see."""
        data = dict(cls=self.js_class)

        for key, value in self.js_dict_items():
            data[key] = self.convert(value)

        return data

    def convert(self, value):
        """Convert a python value into a JSON compatible value."""
        if isinstance(value, JsDictMixin):
            return value.js_dict()
        elif hasattr(value, '__iter__') and not value:
            return []
        elif (hasattr(value, '__iter__') and
                isinstance(value[0], JsDictMixin)):
            return [x.js_dict() for x in value]
        else:
            return value
