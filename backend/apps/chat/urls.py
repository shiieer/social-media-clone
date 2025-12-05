from django.urls import path
from . import views

urlpatterns = [
    path("room/create/", views.CreateRoomView.as_view(), name="create-room"),
    path("room/<int:room_id>/message/", views.SendMassageView.as_view(), name="send-message"),
]

