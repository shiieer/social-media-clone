"""
Management command to seed the database with admin and test users.

Usage:
    python manage.py seed_users
    python manage.py seed_users --admin-only
    python manage.py seed_users --users-only
    python manage.py seed_users --count 10
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.profiles.models import Profile

User = get_user_model()


class Command(BaseCommand):
    help = "Seed the database with admin and test users"

    def add_arguments(self, parser):
        parser.add_argument(
            "--admin-only",
            action="store_true",
            help="Only create admin user",
        )
        parser.add_argument(
            "--users-only",
            action="store_true",
            help="Only create regular users",
        )
        parser.add_argument(
            "--count",
            type=int,
            default=5,
            help="Number of regular users to create (default: 5)",
        )

    def handle(self, *args, **options):
        admin_only = options["admin_only"]
        users_only = options["users_only"]
        user_count = options["count"]

        if not admin_only:
            self.create_regular_users(user_count)

        if not users_only:
            self.create_admin_user()

        self.stdout.write(
            self.style.SUCCESS(
                f"\n✅ Successfully seeded users!"
            )
        )

    def create_admin_user(self):
        """Create a superuser/admin account."""
        username = "admin"
        email = "admin@example.com"
        password = "admin123"

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(
                    f"⚠️  Admin user '{username}' already exists. Skipping..."
                )
            )
            return

        admin = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            bio="I am the administrator of this social media platform.",
            profile_img="https://via.placeholder.com/150",
        )

        # Create profile for admin
        Profile.objects.get_or_create(
            user=admin,
            defaults={
                "bio": "I am the administrator of this social media platform.",
            },
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Created admin user: {username} (email: {email}, password: {password})"
            )
        )

    def create_regular_users(self, count):
        """Create regular test users."""
        created_count = 0
        skipped_count = 0

        users_data = [
            {
                "username": "johndoe",
                "email": "john@example.com",
                "password": "password123",
                "bio": "Photography enthusiast and travel lover 📸✈️",
                "profile_img": "https://via.placeholder.com/150?text=John",
            },
            {
                "username": "janedoe",
                "email": "jane@example.com",
                "password": "password123",
                "bio": "Food blogger and recipe creator 🍳👩‍🍳",
                "profile_img": "https://via.placeholder.com/150?text=Jane",
            },
            {
                "username": "alice",
                "email": "alice@example.com",
                "password": "password123",
                "bio": "Fitness coach and yoga instructor 💪🧘",
                "profile_img": "https://via.placeholder.com/150?text=Alice",
            },
            {
                "username": "bob",
                "email": "bob@example.com",
                "password": "password123",
                "bio": "Tech enthusiast and developer 💻🚀",
                "profile_img": "https://via.placeholder.com/150?text=Bob",
            },
            {
                "username": "charlie",
                "email": "charlie@example.com",
                "password": "password123",
                "bio": "Musician and music producer 🎵🎸",
                "profile_img": "https://via.placeholder.com/150?text=Charlie",
            },
        ]

        # Use provided data first, then generate additional users if needed
        for i in range(count):
            if i < len(users_data):
                user_data = users_data[i]
            else:
                # Generate additional users
                user_data = {
                    "username": f"user{i+1}",
                    "email": f"user{i+1}@example.com",
                    "password": "password123",
                    "bio": f"This is user {i+1}'s bio.",
                    "profile_img": f"https://via.placeholder.com/150?text=User{i+1}",
                }

            username = user_data["username"]
            email = user_data["email"]
            password = user_data["password"]

            if User.objects.filter(username=username).exists():
                skipped_count += 1
                self.stdout.write(
                    self.style.WARNING(
                        f"⚠️  User '{username}' already exists. Skipping..."
                    )
                )
                continue

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                bio=user_data.get("bio", ""),
                profile_img=user_data.get("profile_img", ""),
            )

            # Create profile for user
            Profile.objects.get_or_create(
                user=user,
                defaults={
                    "bio": user_data.get("bio", ""),
                },
            )

            created_count += 1
            self.stdout.write(
                self.style.SUCCESS(
                    f"✅ Created user: {username} (email: {email}, password: {password})"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"\n📊 Summary: Created {created_count} user(s), skipped {skipped_count} existing user(s)"
            )
        )

