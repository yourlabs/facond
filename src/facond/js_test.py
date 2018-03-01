# flake8: noqa: D*
"""Unit tests for JsDictMixin."""

from facond.js import JsDictMixin


def test_convert_int():
    assert JsDictMixin().convert(1) == 1


def test_convert_string():
    assert JsDictMixin().convert('a') == 'a'


def test_convert_list():
    assert JsDictMixin().convert(['a']) == ['a']
