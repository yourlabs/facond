from django.conf.urls import url

from views import FormSetView, FormView, HomeView


urlpatterns = [
    url(
        r'^$',
        HomeView.as_view(template_name='base.html')
    ),
    url(
        r'^(?P<app>[\w_.]+)/$',
        FormView.as_view(),
        name='form',
    ),
    url(
        r'^(?P<app>[\w_.]+)/formset/$',
        FormSetView.as_view(),
        name='formset',
    ),
]
