from django.contrib import admin

from .models import Profile, Follow


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "bio")
    search_fields = ("user__username",)


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ("id", "follower", "following", "created_at")
    search_fields = ("follower__username", "following__username")


