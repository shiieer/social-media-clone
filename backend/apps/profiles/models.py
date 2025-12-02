from django.conf import settings
from django.db import models


class Profile(models.Model):
    user = models.OneToOneModel(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self) -> str:
        return f"Profile({self.user.username})"


