Design documentation for django-dynamic-field
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Classes
=======

The way this is going, we're going to have an equivalent JS class for each
Python class. For example, using the RemoveField Action would remove a field
from the form object right before server side validation, but it should also
remove it in the browser (or rather, hide it, so that it can be re-added
later).

While classes have equivalents on the client and the server, they are of course
not quite the same. On the client, an Action can be un-applied if a user
changes their mind and makes a Condition that did pass before fail now. On the
server, we don't need to un-apply actions, because data is completely out of
the hands of user at this point.

Form
    Form objects contain the list of rules for each field, it's responsible
    for executing them.

Rule
    Rule objects contain all the Actions for one field, and is responsible for
    executing them.

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
manipulation. DOM manipulation is also encapsulated inside Form objects, in
functions such as ``fieldShow()``, ``fieldHide()``, ``fieldValueGet()``, and so
on, for example:

.. code-block:: javascript

    // Return the jQuery field container for a field name, it's the element that
    // contains both the field and label.
    ddf.form.Form.prototype.fieldContainerGet = function(field) {
        return this.fieldGet(field).parents().has(this.fieldLabelGet(field)).first();
    }

The more logic that couples the DOM we can put inside the Form object, the
easier it will be to subclass it and replace the ones that are not compatible
with a particular DOM tree outside the admin:

.. code-block:: javascript

    ddf.form.BootstrapForm.prototype = Object.create(ddf.form.Form.prototype);
    ddf.form.BootstrapForm.prototype.fieldContainerGet = function(field) {
        // something else
    }

Then, actions can be abstracted from the DOM as such:

.. code-block:: javascript

    // Hide the field.
    ddf.action.Remove.prototype.apply = function(form, field) {
        form.fieldHide(field);
    }

    // Show the field.
    ddf.action.Remove.prototype.unapply = function(form, field) {
        form.fieldShow(field);
    }

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

We have the script you can see in ``src/ddf/static/ddf.js``, but I'm currently
revamping this:

- code in ES6 and build ES5 code, because we're trying to have some sort of
  equivalent mindset between python and js code, so it'll be easier if the
  `class syntax look alike
  <http://es6-features.org/#ClassInheritance>`_,
- use standard module import code, with requirejs and browserify,
- we need unit tests and coverage, let's learn from jal !
- use gulp to simplify the workflow of course !
