Tutorial
========

What this is
------------

This app first is the implementation of a simple pattern to modify form
datastructures based on rules, which have actions, which have conditions.

It is also an NPM module usable on its own, in order to make a basic reactive
form: ``npm install django-dynamic-forms``, the name is misleading because the
lib doesn't actually require Python at all.

It is also a Django app usable on its own, or with the NPM module in which case
Python will drive it with JSON object dumps, and you can define rules for
Django forms that the JS is able to pick up where the server left it to make
the displayed form reactive to user input.

We document the JS and make it a first class citizen in this app, but if you
are a Python developer then you just need to import the NPM module in your page
to activate it: it will pick up the JSON object dump from the script tag left
by ddf.FormMixin in every form element it finds: make your configuration from
Python.

The pattern inside
------------------

It lets you define a Rule per form field. Each Rule has at least one Action,
each Action has at least one Condition.

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

For this, we define a Rule for the service field, with Action
``RemoveChoices(['support'])`` and Condition ``ValueIs('platform',
'windows')``.

Pure JavaScript example
-----------------------

If we are using pure javascript, and our own server side backend ie. in PHP::

    import * as ddf from 'django-dynamic-fields'
    let form = new ddf.Form(
        document.querySelector('#your-form'),  # form HTMLElement
        [new ddf.Rule(
            'service', [
            new ddf.RemoveChoices(
                ['Support'],
                new ddf.ValueIs('platform', 'windows')
            )]
        )]
    )
    form.bind()

Django example
--------------

You can see where this is going: you can have the same Rule/Action/Condition
datastructure on both the server and client. So if we are doing Django then we
can use ddf.FormMixin to define our RAC structure and ddf.FormMixin will add a
fake field and widget which will actually render as a script tag, which ddf
will pick up automatically in JS, so you don't have to do the above JS code,
here's how you can do it instead::

    from ddf import shortcuts as ddf
    from django import forms

    class TestForm(ddf.FormMixin, forms.Form):
        platform = PlatformChoiceField()
        service = ServiceChoiceField()

        _ddf = dict(  # Support dict for convenience and simple cases
            service=[
                ddf.RemoveChoices(
                    ['Support'],
                    ddf.ValueIs('platform', 'Windows'),
                )
            ]
        )

In this case, FormMixin will be able to execute the python code to improve
input validation, and the ddf scripts can be started with just 2 words::

    import 'django-dynamic-fields'

Important R&D ? Wasted human resource ?

Awesome ? Outrageous ?

Confusion ? Hard feelings ?

Let me know what you think !
