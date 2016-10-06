import os

from django.conf.urls import include, url
from django.conf import settings
from django.contrib import admin
from django.views.generic import TemplateView

from .views import HomeView, FormSetView, FormView


urlpatterns = [
    url(
        r'^$',
        HomeView.as_view(template_name='base.html')
    ),
    url(
        r'^(?P<app>[\w_]+)/$',
        FormView.as_view(),
        name='form',
    ),
    url(
        r'^(?P<app>[\w_]+)/formset/$',
        FormSetView.as_view(),
        name='formset',
    ),
]
