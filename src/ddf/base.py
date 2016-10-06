class DictMixin(object):
    def dict(self):
        data = dict(cls='%s.%s' % (type(self).__module__, type(self).__name__))

        for key, value in self.__dict__.items():
            if isinstance(value, DictMixin):
                data[key] = value.dict()
            elif (hasattr(value, '__iter__')
                    and isinstance(value[0], DictMixin)):

                data[key] = [x.dict() for x in value]
            else:
                data[key] = value

        return data
