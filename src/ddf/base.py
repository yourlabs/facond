"""Export Python objects to JavaScript."""


class DictMixin(object):
    """Make dicts to export in JSON, and use with ddf.instanciate() in JS."""

    def dict(self):
        """Return what the JS will see."""
        data = dict(cls='%s.%s' % (type(self).__module__, type(self).__name__))

        for key, value in self.__dict__.items():
            if isinstance(value, DictMixin):
                data[key] = value.dict()
            elif (hasattr(value, '__iter__') and
                    isinstance(value[0], DictMixin)):

                data[key] = [x.dict() for x in value]
            else:
                data[key] = value

        return data
