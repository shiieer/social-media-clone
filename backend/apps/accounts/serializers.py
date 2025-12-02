from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password



User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required = True,
        validators = [UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True, 
        required=True
    )

    class Meta:
        model = User
        fields = ("username", "password", "password2", "email")

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "bio", "avatar"]

class CustomLoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        login_input = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(username=login_input, password=password)

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

        avatar_url = None
        if user.avatar:
            try:
                # Get request from context if available
                request = self.context.get('request') if self.context else None
                if request:
                    avatar_url = request.build_absolute_uri(user.avatar.url)
                else:
                    avatar_url = user.avatar.url
            except Exception:
                avatar_url = None
        
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "bio": user.bio,
                "avatar": avatar_url,
            }
        }