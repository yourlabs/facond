import os

from django import forms
from django.conf import settings
from django.conf.urls import url
from django.forms import formset_factory
from django.utils.module_loading import import_string
from django.views import generic


class FormView(generic.FormView):
    template_name = 'form.html'

    def get_form_class(self):
        return import_string('%s.forms.TestForm' % self.kwargs['app'])

    def form_valid(self, form):
        return self.form_invalid(form)


class FormSetView(FormView):
    template_name = 'formset.html'

    def get_form_class(self):
        return formset_factory(super(FormSetView, self).get_form_class(), extra=2)


class HomeView(generic.TemplateView):
    template_name = 'base.html'

    def get_context_data(self):
        return {
            'examples': [
                app for app in settings.INSTALLED_APPS
                if os.path.exists(
                    os.path.join(
                        settings.BASE_DIR,
                        app,
                        'forms.py'
                    )
                )
            ]
        }
