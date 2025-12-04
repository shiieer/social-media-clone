from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.login_view, name="login"),
    path("register/", views.register_view, name="register"),
    path("token/refresh/", views.CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("me/", views.me_view, name="me"),
]


