from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.CreatedPostView.as_view(), name="create-post"),
    path("feed/", views.FeedView.as_view(), name="feed"),
    path("<int:post_id>/like/", views.LikeToggleView.as_view(), name="like-toggle"),
    path("<int:post_id>/save/", views.SaveToggleView.as_view(), name="save-toggle"),
    path("<int:post_id>/comment/", views.AddCommentView.as_view(), name="add-comment"),
]

