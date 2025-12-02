from rest_framework import serializers

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "username", "bio", "avatar"]

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Follow

User = get_user_model()

class PublicProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "bio", "avatar", "followers_count", "following_count"]

    def get_followers_count(self, obj):
        return obj.followers.count()
    
    def get_following_count(self, obj):
        return obj.following.count()