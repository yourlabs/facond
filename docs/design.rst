Design documentation for django-dynamic-field
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Classes
=======

We have equivalent JS class for each Python class. For example, using the
RemoveField Action would remove a field from the form object right before
server side validation, but it should also remove it in the browser (or rather,
hide it, so that it can be re-added later).

While classes have equivalents on the client and the server, they are of course
not quite the same. On the client, an Action can be un-applied if a user
changes their mind and makes a Condition that did pass before fail now. On the
server, we apply rules before validation, and un-apply them after to have
expected display.

Form
    Form objects contain the list of Rules, one per field, it's responsible for
    executing them. In Python it's represented by the FormMixin which should
    work on any Form class.

Rule
    Rule objects contain all the Actions for one field, and is responsible for
    executing them. We could have named this Field too, but it would have been
    confusing with actual form Field objects.

Action
    An action may change user data or even the form definition, but it also
    contains a list of Conditions it should test before doing anything. On the
    client it can un-apply itself.

Condition
    Condition objects should just check something in the form, for example that
    a particular field has or hasn't a value. When it passes, this should
    prevent the Action from being applied on the server, and un-apply it
    dynamically on the client.

Form
----

Python
``````

Form classes should execute each Action before Django's ``full_clean()``
method is called, because Actions may hack data and form fields. It must be
done in ``full_clean()`` because Actions may also raise ValidationErrors.

JavaScript
``````````

On the client side, Form objects are also responsible for executing their list
of Rules when a field value change. This makes them responsible for DOM
manipulation. DOM manipulation is also encapsulated inside Field objects, in
functions such as ``hide()``, ``show()``, or with getters/setters such as
``value``, and so on.

Another important thing to note here is that a Form in JS really matches a Form
in Python. This means that it supports the ``prefix`` attribute, and that there
would be as many instances of ``Form`` objects in a formset in the client
exactly like there would on the server.

Python
======

Nothing exceptional here, we're going with the standard ingredients:

- tdd,
- coverage,
- py.test,

JavaScript
==========

We have an npm module called django-dynamic-fields, which you can install with
npm or edit in ``src/ddf``.
