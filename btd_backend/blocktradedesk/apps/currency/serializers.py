from django.contrib.auth import get_user_model
from rest_framework import serializers

from _utils.fields import TimestampField
from .models import Currency, CurrencyPerDayRate, UserCurrency, Transaction, CurrencyPerHourRate

UserModel = get_user_model()


class CurrencySerailizer(serializers.ModelSerializer):
    current_rate = serializers.SerializerMethodField()

    # per_month = serializers.SerializerMethodField()

    def get_current_rate(self, obj):
        value = obj.get_current_rate()
        return value

    #
    # def get_per_month(self, obj):
    #     value =  obj.get_per_month(obj.get_current_rate())
    #     return value
    class Meta:
        model = Currency
        fields = ('name', 'code', 'current_rate',)


# Common cserializer class for day, hour rates
class CurrencyRatesSerializer(serializers.ModelSerializer):
    currency = serializers.SlugRelatedField(read_only=True, slug_field='name')
    price = serializers.FloatField()
    change = serializers.FloatField()
    created = TimestampField()


class CurrencyDayRatesSerializer(CurrencyRatesSerializer):
    class Meta:
        model = CurrencyPerDayRate
        fields = ('currency', 'price', 'created')


class CurrencyHourRatesSerializer(CurrencyRatesSerializer):
    class Meta:
        model = CurrencyPerHourRate
        fields = ('currency', 'price', 'created')


class UserCurrencySerializer(serializers.ModelSerializer):
    currency = CurrencySerailizer()
    amount = serializers.FloatField()

    class Meta:
        model = UserCurrency
        fields = ('currency', 'amount',)


class UserTransactionSerializer(serializers.ModelSerializer):
    currency = CurrencySerailizer()
    amount = serializers.FloatField()
    price = serializers.FloatField()
    created = serializers.SerializerMethodField()

    def get_created(self, object):
        return object.created.date()

    class Meta:
        model = Transaction
        fields = ('transaction_type', 'amount', 'price', 'currency', 'message', 'created')
