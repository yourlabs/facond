from .forms import TestForm


def test_removes_field():
    form = TestForm(dict(
        kind='nonprofit',
        title='Dr.',
        name='Feelgood',
    ))

    assert form.is_valid()
    assert 'title' not in form.cleaned_data


def test_validates_choices():
    form = TestForm(dict(
        kind='nonprofit',
        name='YourLabs',
    ))

    assert form.is_valid()

    form = TestForm(dict(
        kind='person',
        title='Dr.',
        name='Feelgood',
    ))

    assert form.is_valid()


def test_js_dict():
    assert TestForm(prefix='test').js_dict() == {
        'cls': 'ddf.form.Form',
        'prefix': 'test',
        'fields': {
            'kind': {
                'cls': 'ddf.form.Field',
                'name': 'kind',
            },
            'title': {
                'cls': 'ddf.form.Field',
                'name': 'title',
            },
            'name': {
                'cls': 'ddf.form.Field',
                'name': 'name',
            },
        },
        'rules': [
            {
                'cls': 'ddf.rule.Rule',
                'field': 'title',
                'actions': [
                    {
                        'cls': 'ddf.action.Remove',
                        'conditions': [
                            {
                                'cls': 'ddf.condition.ValueIs',
                                'field': 'kind',
                                'value': 'nonprofit'
                            }
                        ]
                    }
                ]
            }
        ]
    }


def test_removes_field_during_validation():
    form = TestForm(dict(
        kind='nonprofit',
        title='M',
        name='YourLabs Hacker Panarchy'
    ))
    assert form.is_valid()
    assert list(form.cleaned_data.keys()) == ['kind', 'name']
    assert list(form.fields.keys()) == ['kind', 'title', 'name', 'django_dynamic_fields']
