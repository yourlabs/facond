.. image:: https://img.shields.io/pypi/dm/django-dynamic-fields.svg
   :target: https://pypi.python.org/pypi/django-dynamic-fields
.. image:: https://secure.travis-ci.org/yourlabs/django-dynamic-fields.png?branch=master
    :target: http://travis-ci.org/yourlabs/django-dynamic-fields
.. image:: https://codecov.io/github/yourlabs/django-dynamic-fields/coverage.svg?branch=master
    :target: https://codecov.io/github/yourlabs/django-dynamic-fields?branch=master
.. image:: https://readthedocs.org/projects/django-dynamic-fields/badge/?version=develop
    :target: http://django-dynamic-fields.readthedocs.io/en/develop/?badge=develop
    :alt: Documentation status

This app provides features a form class dynamic, both on the client and server
side. For example if you want a field to be remove if another field has a
particular value or to filter choices based on a set conditions. The `demo
<https://ddf-yourlabs.rhcloud.com>`_ is automatically updated when a commit is
`tested
<https://travis-ci.org/yourlabs/django-dynamic-fields>`_ on master.

Pypy, Python 2.7, 3.4, Django 1.8+ are supported.

Example
=======

For example, if your form should allow support only if linux is
selected:

.. code-block:: python

    from ddf import shortcuts as ddf

    class TestForm(ddf.FormMixin, forms.Form):
        platform = forms.ChoiceField(choices=(
            ('Linux', 'Linux'),
            ('Windows', 'Windows'),
        ))
        service = forms.ChoiceField(choices=(
            ('Format', 'Format'),
            ('Support', 'Support')
        ))

        # Remove the 'Support' choice from the 'service' field if 'platform'
        # value is 'Windows':
        _ddf = dict(
            service=[
                ddf.RemoveChoices(
                    ['Support'],
                    ddf.ValueIs('platform', 'Windows'),
                )
            ]
        )

In this example, we create a configuration field and add the RemoveChoices
action to the service field, with the condition that the platform field value
is Windows.

The configuration field is able to render the configuration as a JSON dict,
with the form prefix it's being rendered with. Then, the equivalent of each
Action and Condition objects are instanciated in JavaScript, allowing dynamic
user experience.

A configuration is structured as such: for each field, you may add a list of
actions, for each action a list of conditions. When the user changes a field,
each action's conditions are evaluated and if they all pass then the action is
applied, otherwise it is unapplied. Possibilities are huge here.

Dual-license
============

It is released with the Creative Commons Attribution-NonCommercial 3.0 Unported
License, but a commercial license is available, please get in touch my username
@ yourlabs.org if you are interrested.

Note that the money goes to YourLabs, a non-profit foundation to promote the
role of hackers in the process of making our society more fair and free, while
using their skills to develop local economy and give internet back to the
people.

Status
======

The project is pretty young, but the basic building blocks are there. We should
be able to add actions and conditions easily.

Why
===

We've been inventing this over and over again for years. The `first time I
invented this was in 2009 <https://djangosnippets.org/snippets/1358/>`_ and
honnestly my python, django and javascript skills were pretty weak back then.
Since then, I've seen users asking this, paying me as a consultant for this,
making `pull requests to have this in a per-app basis
<https://github.com/yourlabs/django-autocomplete-light/pull/732>`_. It's about
time we have a generic solution that works for all kinds of fields, and not
just the ones of the apps we maintain.
