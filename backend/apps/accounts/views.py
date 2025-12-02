from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import LoginSerializer, UserSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    """
    Very simple username/password login that returns user data.
    (No JWT here; your mobile app can store session or extend later.)
    """
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = authenticate(
        request,
        username=serializer.validated_data["username"],
        password=serializer.validated_data["password"],
    )
    if not user:
        return Response(
            {"detail": "Invalid username or password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    data = UserSerializer(user).data
    return Response({"success": True, "data": data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Return current authenticated user info."""
    data = UserSerializer(request.user).data
    return Response({"success": True, "data": data})


