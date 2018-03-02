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
