Facond FAQ
~~~~~~~~~~

User
====

How to remove flash of element before they are hidden ?
-------------------------------------------------------

tl;dr
    Define CSS before your ``<form>``: ``.facond-hide { display: none; }``.

This is because of the time between the moment a field container is rendered
with ``.facond-hide`` CSS class, and the moment this class is defined.

Currently, we try to prevent this in different ways, but it might not be enough
in some cases (ie. with django-material which completely bypasses Django's
rendering mechanisms we hook int).

Developer
=========

Contributing to facond
~~~~~~~~~~~~~~~~~~~~~~

Please, make pull requests rathen than issues when possible.
