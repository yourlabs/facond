import pytest

from django import forms

from forms import TestForm


def test_invalidates_choices():
    form = TestForm(dict(
        platform='Windows',
        service='Support',
    ))

    with pytest.raises(forms.ValidationError):
        form.is_valid()


def test_validates_choices():
    form = TestForm(dict(
        platform='Windows',
        service='Format',
    ))

    assert form.is_valid()
