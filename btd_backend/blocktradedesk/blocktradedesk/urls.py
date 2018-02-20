from django.conf import settings
from django.conf.urls import *
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import reverse_lazy
from django.views.generic.base import RedirectView
from django.views.generic.base import TemplateView
from rest_framework.routers import DefaultRouter
from rest_framework_swagger.views import get_swagger_view

router = DefaultRouter()
schema_view = get_swagger_view(title='blocktradedesk API')

urlpatterns = [
    url(r'^i18n/', include('django.conf.urls.i18n')),
]

urlpatterns += i18n_patterns(
    url(r'^document/$', schema_view),
    url(r'^admin/', admin.site.urls),
    url(r'^django-rq/', include('django_rq.urls')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^user/', include('users.urls', namespace='user')),
    url(r'^currency/', include('apps.currency.urls', namespace='currency')),
    url(r'^api/v1/', include(router.urls)),
    url(r'^$', RedirectView.as_view(url=reverse_lazy('api-root'), permanent=False)),
)

if settings.DEBUG:
    urlpatterns += [
        # Testing 404 and 500 error pages
        url(r'^404/$', TemplateView.as_view(template_name='404.html'), name='404'),
        url(r'^500/$', TemplateView.as_view(template_name='500.html'), name='500'),
    ]

    from django.conf.urls.static import static

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    import debug_toolbar

    urlpatterns += [url(r'^__debug__/', include(debug_toolbar.urls))]
