from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """
    Register the custom User model in the admin so you can see
    users created via API / createsuperuser.
    """

    pass


