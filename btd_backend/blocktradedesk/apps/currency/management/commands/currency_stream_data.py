import json

import requests
from django.conf import settings
from django.core.management.base import BaseCommand
from pymongo import MongoClient

from apps.currency.models import Currency


class Command(BaseCommand):
    def handle(self, database="default", *args, **options):
        currencies = Currency.objects.all()
        API_URL = 'https://api.cryptonator.com/api/ticker/{0}-{1}'
        target_currency = 'usd'
        connection = MongoClient('127.0.0.1', username=settings.MONGO_USERNAME, password=settings.MONGO_PASSWORD,
                                 authSource=settings.MONGO_DATABASE)
        db = getattr(connection, settings.MONGO_DATABASE)
        mongo_currency = getattr(db, settings.MONGO_COLLECTION)
        for currency in currencies:
            data = requests.get(API_URL.format(currency.code.lower(), target_currency))
            if (data.content):
                try:
                    content = json.loads(data.content)
                    if data.status_code == 200 and content['success']:
                        mongo_currency.insert_one({'success':content['success']}, **content['ticker'])
                        self.stdout.write(self.style.SUCCESS('Updated {0} currency prices in database'.format(currency.code)))

                except Exception as e:
                    pass

