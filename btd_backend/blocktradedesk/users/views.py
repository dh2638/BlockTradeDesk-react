from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.forms import model_to_dict
from django.utils.timezone import localtime, now
from django.utils.translation import ugettext_lazy as _
from rest_framework.authtoken.models import Token
from rest_framework.generics import GenericAPIView, CreateAPIView, RetrieveUpdateAPIView, ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from _utils.views import AjaxResponse
from users import serializers as user_serializer
from users.models import UserPassCode, REGISTER, FORGET

UserModel = get_user_model()


class UserLoginAPIView(AjaxResponse, GenericAPIView):
    serializer_class = user_serializer.AuthTokenSerializer
    permission_classes = (AllowAny,)
    list_response = ('first_name', 'last_name', 'email',)
    message = _("You've successfully logged In")

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            data = model_to_dict(user, fields=self.list_response)
            data.update({'token': token.key, 'message': self.message})
            return self.valid_serializer(data)
        else:
            return self.invalid_serializer(serializer)


class UserRegisterAPIView(AjaxResponse, CreateAPIView):
    serializer_class = user_serializer.CreateUserSerializer
    permission_classes = (AllowAny,)
    message = _("We successfully created an account, We sent you an email with "
                "code please validate code for activate account")

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            user = serializer.instance
            passcode, is_created = UserPassCode.objects.get_or_create(user=user, is_verify=False, type=REGISTER)
            send_mail(subject="Account Verification",
                      message="You need to use below code for verify account registeration."
                              "Your OTP number is {}".format(passcode.code),
                      from_email=settings.EMAIL_HOST_USER, recipient_list=[user.email])
            return self.valid_serializer({'message': self.message})
        else:
            return self.invalid_serializer(serializer)


class VerifyUserRegisterAPIView(AjaxResponse, GenericAPIView):
    serializer_class = user_serializer.VerifyPassCodeSerializer
    message = _('Your account is successfully activated.')
    permission_classes = (AllowAny,)
    list_response = ('first_name', 'last_name', 'email',)

    def post(self, request, *args, **kwargs):
        data = dict(request.data.items())
        data.update({'type': REGISTER})
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = UserModel.objects.get(email=email)
            user.is_active = True
            user.save()
            return self.valid_serializer({'message': self.message})
        else:
            return self.invalid_serializer(serializer)


class ForgetPasswordAPIView(AjaxResponse, GenericAPIView):
    serializer_class = user_serializer.ForgetPasswordSerializer
    permission_classes = (AllowAny,)
    message = _("We've sent code to your email, Please confirm")

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            passcode, is_created = UserPassCode.objects.get_or_create(user=user, is_verify=False, type=FORGET)
            send_mail(subject="Forget Password Verification",
                      message="You need to use below code for verify password reset."
                              "Your OTP number is {}".format(passcode.code),
                      from_email=settings.EMAIL_HOST_USER, recipient_list=[user.email])
            return self.valid_serializer({'message': self.message})
        else:
            return self.invalid_serializer(serializer)


class VerifyPassCodeAPIView(AjaxResponse, GenericAPIView):
    serializer_class = user_serializer.VerifyPassCodeSerializer
    message = _('Code is verified')
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        data = dict(request.data.items())
        data.update({'type': FORGET})
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            return self.valid_serializer({'message': self.message})
        else:
            return self.invalid_serializer(serializer)


class SetPasswordAPIView(AjaxResponse, GenericAPIView):
    serializer_class = user_serializer.SetPasswordSerializer
    message = _('Password successfully changed')
    permission_classes = (AllowAny,)


class ChangePasswordAPIView(AjaxResponse, GenericAPIView):
    serializer_class = user_serializer.ChangePasswordSerializer
    permission_classes = (IsAuthenticated,)
    message = _('Password successfully changed')


class UserMeAPIView(RetrieveUpdateAPIView):
    serializer_class = user_serializer.UserSerializer
    message = _('Profile successfully updated')

    def get_object(self):
        return self.request.user

    def get_queryset(self):
        if hasattr(self.request.user, 'profile'):
            return UserModel.objects.filter(email=self.request.user.email)

    def get(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        super(UserMeAPIView, self).update(request, *args, **kwargs)
        return Response(data={'message': self.message})


class FilterQueryset(object):
    def get_queryset(self):
        current_date = localtime(now())
        start_date = self.request.GET.get('start_date')
        end_date = self.request.GET.get('end_date')
        if start_date:
            start_date = datetime.fromtimestamp(float('%s' % start_date))
        else:
            start_date = current_date - timedelta(days=60)
        if end_date:
            end_date = datetime.fromtimestamp(float('%s' % end_date))
        else:
            end_date = current_date
        return self.get_user_queryset().filter(created__gte=start_date, created__lte=end_date)


class UserTransactionAPIView(FilterQueryset, ListAPIView):
    serializer_class = user_serializer.UserTransactionSerializer

    def get_user_queryset(self):
        return self.request.user.user_transactions.all()


class UserCurrencyAPIView(ListAPIView):
    serializer_class = user_serializer.UserCurrencySerializer

    def get_queryset(self):
        return self.request.user.user_currencies.all()
