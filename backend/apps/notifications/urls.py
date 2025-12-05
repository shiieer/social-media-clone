from django.urls import path
from . import views

urlpatterns = [
    path("", views.NotificationListView.as_view(), name="notification-list"),
    path("unread-count/", views.NotificationUnreadCountView.as_view(), name="notification-unread-count"),
    path("<int:notification_id>/read/", views.MarkNotificationAsReadView.as_view(), name="mark-notification-read"),
    path("mark-all-read/", views.MarkAllNotificationsAsReadView.as_view(), name="mark-all-read"),
]

