from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from rest_framework.compat import authenticate

from apps.currency.serializers import UserCurrencySerializer, UserTransactionSerializer
from users.models import CODE_TYPES, UserPassCode

UserModel = get_user_model()


class AuthTokenSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    custom_error_messages = [_('This account not activated'),
                             _("This email account doesn't exist"),
                             _('Please enter a correct email and password.')]

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        try:
            user = UserModel._default_manager.get_by_natural_key(email)
            if not user.is_active:
                raise serializers.ValidationError(
                    {'is_active': False, 'non_field_errors': self.custom_error_messages[0]})
        except UserModel.DoesNotExist:
            raise serializers.ValidationError(self.custom_error_messages[1])
        user = authenticate(request=self.context.get('request'), email=email, password=password)
        if not user:
            raise serializers.ValidationError(self.custom_error_messages[2])
        attrs['user'] = user
        return attrs


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()

    custom_error_messages = [_('This email already exist')]

    def create(self, validated_data):
        user = UserModel.objects.create_user(**validated_data)
        return user

    def validate(self, attrs):
        password = attrs.get('password')
        email = attrs.get('email')
        if UserModel.objects.filter(email=email).exists():
            raise serializers.ValidationError(self.custom_error_messages[0])
        password_validation.validate_password(password)
        return attrs

    class Meta:
        model = UserModel
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'auth_token',)
        read_only_fields = ('auth_token',)
        extra_kwargs = {'password': {'write_only': True}}


class ForgetPasswordSerializer(serializers.Serializer):
    email = serializers.CharField()

    custom_error_messages = [_('Invalid Email ID')]

    def validate(self, attrs):
        email = attrs.get('email')
        try:
            user = UserModel.objects.get(email=email)
            attrs['user'] = user
        except UserModel.DoesNotExist:
            raise serializers.ValidationError(self.custom_error_messages[0])
        return attrs


class VerifyPassCodeSerializer(serializers.Serializer):
    email = serializers.CharField()
    code = serializers.CharField()
    type = serializers.ChoiceField(choices=CODE_TYPES, required=False)

    custom_error_messages = [_('Invalid code'),
                             _('Invalid email for verify code')]

    def validate(self, attrs):
        code = attrs.get('code')
        email = attrs.get('email')
        code_type = attrs.get('type')
        try:
            passcode = UserPassCode.objects.get(user__email=email, is_verify=False, type=code_type)
            if passcode.verify(code):
                passcode.is_verify = True
                passcode.save()
            else:
                raise serializers.ValidationError(self.custom_error_messages[0])
        except UserPassCode.DoesNotExist:
            raise serializers.ValidationError(self.custom_error_messages[1])
        return attrs


class SetPasswordSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    custom_error_messages = [_('Invalid Email ID')]

    def validate(self, attrs):
        # TODo We need to validate user is same that verify token
        password = attrs.get('password')
        email = attrs.get('email')
        try:
            user = UserModel.objects.get(email=email)
            user.set_password(password)
            user.save()
        except UserModel.DoesNotExist:
            raise serializers.ValidationError(self.custom_error_messages[0])
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    custom_error_messages = [_('Old password is not correct')]

    def validate(self, attrs):
        password = attrs.get('password')
        old_password = attrs.get('old_password')
        user = self.context['request'].user
        if not user.check_password(old_password):
            raise serializers.ValidationError(self.custom_error_messages[0])
        password_validation.validate_password(password)
        user.set_password(password)
        user.save()
        return attrs


class UserSerializer(serializers.ModelSerializer):
    user_currencies = UserCurrencySerializer(read_only=True, many=True)
    user_transactions = UserTransactionSerializer(read_only=True, many=True)

    class Meta:
        model = UserModel
        fields = ('id', 'email', 'first_name', 'last_name', 'user_currencies', 'user_transactions')
        read_only_fields = ('email', 'id')
