from django.conf.urls import url

from .views import AllCurrencyAPIView, CurrencyDayDataAPIView, CurrencyHourDataAPIView

urlpatterns = [

    url(r'^all/$', AllCurrencyAPIView.as_view(), name='all_currency'),
    url(r'^day/data/$', CurrencyDayDataAPIView.as_view(), name='currency_day_data'),
    url(r'^hour/data/$', CurrencyHourDataAPIView.as_view(), name='currency_hour_data'),
]
