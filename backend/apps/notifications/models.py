from django.db import models
from apps.accounts.models import User
from apps.posts.models import Post

class Notification(models.Model):
    user = models.ForeignKey(
        User, related_name="notifications", on_delete=models.CASCADE
    )

    actor = models.ForeignKey(
        User, related_name="triggered_notifications", on_delete=models.CASCADE
    )

    type = models.CharField(max_length=30)

    post = models.ForeignKey(
        Post, null=True, blank=True, on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} - {self.type}"