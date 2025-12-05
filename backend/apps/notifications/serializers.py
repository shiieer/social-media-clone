from rest_framework import serializers
from .models import Notification
from apps.accounts.serializers import UserSerializer
from apps.posts.serializers import PostSerializer


class NotificationSerializer(serializers.ModelSerializer):
    actor = UserSerializer(read_only=True)
    post = PostSerializer(read_only=True, required=False)
    
    class Meta:
        model = Notification
        fields = [
            "id",
            "actor",
            "type",
            "post",
            "created_at",
            "is_read",
        ]
        read_only_fields = ["id", "created_at"]

