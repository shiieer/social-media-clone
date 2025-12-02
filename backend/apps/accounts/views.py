from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import CustomLoginSerializer, UserSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    """
    JWT login compatible with the mobile app.

    Returns:
    {
      "success": true,
      "data": { "access": "...", "refresh": "...", "user": {...} }
    }
    """
    serializer = CustomLoginSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)

    token_payload = serializer.validated_data
    return Response({"success": True, "data": token_payload}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Return current authenticated user info."""
    data = UserSerializer(request.user).data
    return Response({"success": True, "data": data})


