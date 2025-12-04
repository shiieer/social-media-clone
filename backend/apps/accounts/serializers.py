from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.IntegerField(source="followers.count", read_only=True)
    following_count = serializers.IntegerField(source="following.count", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "bio", "profile_img", "followers_count", "following_count"]


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())],
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("username", "password", "password2", "email")

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class CustomLoginSerializer(TokenObtainPairSerializer):
    """
    Issue JWT tokens and user payload compatible with the mobile app:
    {
      "refresh": "...",
      "access": "...",
      "user": { id, username, email }
    }
    """
    def validate(self, attrs):
        login_input = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(username=login_input, password=password)

        # Also allow login via email
        if user is None:
            try:
                user_obj = User.objects.get(email=login_input)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if user is None:
            raise serializers.ValidationError(
                {"detail": "Username or password invalid"}
            )

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }