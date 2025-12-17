from django.urls import path
from . import views

urlpatterns = [
    path("rooms/", views.ListChatRoomsView.as_view(), name="list-rooms"),
    path("suggested-users/", views.SuggestedUsersView.as_view(), name="suggested-users"),
    path("room/get-or-create/", views.GetOrCreateRoomView.as_view(), name="get-or-create-room"),
    path("room/<int:room_id>/messages/", views.GetRoomMessagesView.as_view(), name="get-messages"),
    path("room/<int:room_id>/message/", views.SendMessageView.as_view(), name="send-message"),
    path("room/<int:room_id>/mark-read/", views.MarkMessagesAsReadView.as_view(), name="mark-messages-read"),
]

