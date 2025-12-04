from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import CustomLoginSerializer, UserSerializer, RegisterSerializer


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


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new user and return JWT tokens.

    Returns:
    {
      "success": true,
      "data": { "access": "...", "refresh": "...", "user": {...} }
    }
    """
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = serializer.save()
    
    # Generate JWT tokens for the new user
    refresh = RefreshToken.for_user(user)
    
    return Response({
        "success": True,
        "data": {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }
    }, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Return current authenticated user info."""
    data = UserSerializer(request.user).data
    return Response({"success": True, "data": data})


class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view that returns data in the same format as the mobile app expects.
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # Wrap the response in the expected format
        if response.status_code == 200:
            return Response({
                "success": True,
                "data": response.data
            }, status=status.HTTP_200_OK)
        
        return response


