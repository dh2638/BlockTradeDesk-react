from django.conf.urls import url

from users import views

urlpatterns = [
    url(r'^login/$', views.UserLoginAPIView.as_view(), name='login'),
    url(r'^register/$', views.UserRegisterAPIView.as_view(), name='register'),
    url(r'^register/verify/$', views.VerifyUserRegisterAPIView.as_view(), name='register_verify'),
    url(r'^forget-password/$', views.ForgetPasswordAPIView.as_view(), name='forget_password'),
    url(r'^forget-password/verify/$', views.VerifyPassCodeAPIView.as_view(), name='forget_password_verify'),
    url(r'^forget-password/set-password/$', views.SetPasswordAPIView.as_view(), name='forget_pasword_set_password'),
    url(r'^change-password/$', views.ChangePasswordAPIView.as_view(), name='change_password'),
    url(r'^me/$', views.UserMeAPIView.as_view(), name='me'),
    url(r'^transations/$', views.UserTransactionAPIView.as_view(), name='transactions'),
    url(r'^currencies/$', views.UserCurrencyAPIView.as_view(), name='currencies'),

]
