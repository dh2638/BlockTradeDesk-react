# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import timedelta

from django.utils.timezone import localtime, now
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from _utils.views import groupby_queryset_with_fields
from .models import Currency, CurrencyPerDayRate, CurrencyPerHourRate
from .serializers import CurrencyDayRatesSerializer, CurrencySerailizer, CurrencyHourRatesSerializer


def get_transactions(queryset, start_date=None, end_date=None):
    current_date = localtime(now())
    if not end_date:
        end_date = current_date
    if not start_date:
        start_date = current_date - timedelta(days=60)
    queryset = queryset.filter(created__gte=start_date, created__lte=end_date)
    grouped_data = groupby_queryset_with_fields(queryset, ['transaction_type'])
    transactions = {}
    for data in grouped_data:
        for row in grouped_data[data]:
            transactions[row['grouper'].lower()] = row['list']
    return transactions


class AllCurrencyAPIView(ListAPIView):
    serializer_class = CurrencySerailizer
    queryset = Currency.objects.all()


# Common Class for Day, Hour API View
class CurrencyDataAPiView(ListAPIView):
    pagination_class = None

    # def get_queryset(self):
    #     currency_code = self.request.GET.get('currency__code')
    #     start_date = self.request.GET.get('start_date')
    #     end_date = self.request.GET.get('end_date')
    #     kwargs = {}
    #     if currency_code:
    #         kwargs.update({'currency__code': currency_code.upper()})
    #     if start_date:
    #         start_date = datetime.fromtimestamp(float('%s' % start_date))
    #         kwargs.update({'created__gte': start_date})
    #     if end_date:
    #         end_date = datetime.fromtimestamp(float('%s' % end_date))
    #         kwargs.update({'created__lte': end_date})
    #     return self.queryset.filter(**kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        data = {'currency': map(lambda x: dict(x), serializer.data)}
        status = {}
        for currency in Currency.objects.all():
            status.update({currency.name: currency.get_per_month()})
        data.update({"status": status})
        return Response(data)


class CurrencyDayDataAPIView(CurrencyDataAPiView):
    serializer_class = CurrencyDayRatesSerializer
    queryset = CurrencyPerDayRate.objects.all()


class CurrencyHourDataAPIView(CurrencyDataAPiView):
    serializer_class = CurrencyHourRatesSerializer
    queryset = CurrencyPerHourRate.objects.all()
