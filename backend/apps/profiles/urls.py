from django.urls import path

from .views import MyProfileView, PublicProfileView, PublicProfileByUsernameView, FollowToggleView

urlpatterns = [
    path("me/", MyProfileView.as_view(), name="my-profile"),
    path("username/<str:username>/", PublicProfileByUsernameView.as_view(), name="public-profile-by-username"),
    path("<int:user_id>/", PublicProfileView.as_view(), name="public-profile"),
    path("<int:user_id>/follow/", FollowToggleView.as_view(), name="follow-toggle"),
]


