# flake8: noqa: D*

from ddf_examples.remove_fields.forms import TestForm as RemoveFieldsForm


def test_form_dict():
    assert RemoveFieldsForm(prefix='test-').js_dict() == {
        'cls': 'ddf.form.Form',
        'prefix': 'test-',
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
