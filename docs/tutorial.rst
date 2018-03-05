Tutorial
~~~~~~~~

What this is
============

The pattern inside
------------------

This app provides an implementation of a simple pattern to make dynamic forms:

- a Form has a list of Action, such as RemoveChoices,
- an Action has a list of Condition, such as ValueIs.

You can use client side, server side, or both, in which case server side
controls the client side (write only python).

On the client side, it will attach to input events on the form to execute
actions by calling Action.execute(form) which will:

- call Action.apply(form) when all conditions validate on the form,
- call Action.unapply(form) when at least one condition fails to validate.

On the server side, it will call Action.execute(form) before validation which
will:

- call Action.apply(form) when all Condition validate on the form,
- call Action.unapply(form) for each condition that has been applied, but it's
  just to restore enough for redisplay of the form, there's no need to unapply
  everything.

Example
-------

Consider such a Linux shop which offers support and format of computers with
Linux, and only Format for computers with Windows, they make a beautiful Web
2.0 form::

    Platform: [ ] Linux [ ] Windows
    Service: [ ] Support [ ] Format

The form should look either like this::

    Platform: [ ] Linux [X] Windows
    Service: [ ] Format

Or that::

    Platform: [X] Linux [ ] Windows
    Service: [ ] Support [ ] Format

But, God forbids, a user shouldn't **ever** be able to select both "Windows"
and "Support", we don't want this to happen **or kittens will die**::

    Platform: [ ] Linux [X] Windows
    Service: [X] Support [ ] Format

We want to ensure this behaves properly during initial rendering,
validation, rerendering, and of course live in the browser.

For this, we define an Action ``RemoveChoices('service', ['support'])`` with a
Condition ``ValueIs('platform', 'windows')``.

Getting started
===============

NPM users
---------

If you are going to use Django: skip this section.

If you are an NPM user and are not going to use Django::

    npm install facond

Then, import the lib and bind some action on a form::

    import * as facond from 'facond'

    let form = new facond.Form(
        document.querySelector('#your-form'),  # form HTMLElement
        new ddf.RemoveChoices(
            'service',
            ['Support'],
            new ddf.ValueIs('platform', 'windows')
        )]
    )

    form.bind()

Django users
------------

If you are a Django user, then you don't have to deal with NPM or anything in
JS::

    pip install facond

Then all you need to do is use the ``facond.Form`` with ``facond_actions`` for
list of :py:class:`~facond.actions.Action` in Python, and JS will be taken care
of automagically as long as you render ``{{ form.media }}`` - it has no
dependency to jquery or anything else, which means it works out of the box in
the admin, even after Django 2.0::

    from facond import shortcuts as facond
    from django import forms class TestForm(facond.Form, forms.Form):
        platform = PlatformChoiceField()
        service = ServiceChoiceField()

        facond = [
            facond.RemoveChoices(
                'service',
                ['Support'],
                facond.ValueIs('platform', 'Windows'),
            )
        ]

This should just work.

Important R&D ? Wasted human resource ?

Awesome ? Outrageous ?

Confusion ? Hard feelings ?

Let me know what you think !
