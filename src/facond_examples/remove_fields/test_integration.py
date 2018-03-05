# flake8: noqa: D103
"""Tests for the remove field example."""
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
        'cls': 'facond.forms.Form',
        'prefix': 'test',
        'fields': {
            'kind': {
                'cls': 'facond.forms.Field',
                'name': 'kind'
            },
            'title': {
                'cls': 'facond.forms.Field',
                'name': 'title'
            },
            'name': {
                'cls': 'facond.forms.Field',
                'name': 'name'
            }
        },
        'actions': [
            {
                'cls': 'facond.actions.RemoveField',
                'field': 'title',
                'conditions': [
                    {
                        'cls': 'facond.conditions.ValueIs',
                        'field': 'kind',
                        'value': 'nonprofit'
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
    assert sorted(list(form.cleaned_data.keys())) == sorted(['kind', 'name'])
    assert list(form.fields.keys()) == ['kind', 'title', 'name', 'facond']
