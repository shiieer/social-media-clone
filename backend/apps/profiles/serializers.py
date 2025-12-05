from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Profile, Follow


User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "username", "bio", "avatar"]


class PublicProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        # Represent a user's public profile using their Profile model
        model = Profile
        fields = [
            "id",
            "username",
            "bio",
            "avatar",
            "followers_count",
            "following_count",
        ]

    def get_followers_count(self, obj):
        # obj is Profile; use its user to count followers
        return Follow.objects.filter(following=obj.user).count()

    def get_following_count(self, obj):
        return Follow.objects.filter(follower=obj.user).count()