import time
from datetime import datetime
from django.core.management.base import BaseCommand
from django.db.models import Avg

from apps.currency.models import Currency, CurrencyPerDayRate


class Command(BaseCommand):
    def handle(self, database="default", *args, **options):
        currencies = Currency.objects.all()
        target_currency = 'usd'
        current_date = datetime.now().date()
        timestamp = time.mktime(current_date.timetuple())
        for currency in currencies:
            today_rates = currency.rates_per_hour.filter(timestamp__gte=timestamp).aggregate(
                price_avg=Avg('price'), change_avg=Avg('change'))
            if today_rates['price_avg'] and today_rates['change_avg']:
                kwargs = {
                    'currency': currency,
                    'target_currency': target_currency,
                    'price': today_rates['price_avg'],
                    'change': today_rates['change_avg']
                }
                CurrencyPerDayRate.objects.create(**kwargs)
                self.stdout.write(self.style.SUCCESS('Updated {0} currency prices in database'.format(currency.code)))
