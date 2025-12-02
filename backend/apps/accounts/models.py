from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model (extend later if needed)."""

    # You can add extra fields here, e.g. bio, avatar, etc.
    pass


