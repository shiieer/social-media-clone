from rest_framework import generics, permissions

from .models import Profile
from .serializers import ProfileSerializer


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Follow
from .serializers import PublicProfileSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

User = get_user_model()

class PublicProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = PublicProfileSerializer
    permission_classes = [AllowAny]

class FollowToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            target = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, 
                status=404
            )
        
        me = request.user
        
        # Prevent user from following themselves
        if me.id == target.id:
            return Response(
                {"error": "You cannot follow yourself"}, 
                status=400
            )

        already = Follow.objects.filter(follower=me, following=target)

        if already.exists():
            already.delete()
            return Response({"message": "Unfollowed", "is_following": False})
        else:
            Follow.objects.create(follower=me, following=target)
            return Response({"message": "Followed", "is_following": True})