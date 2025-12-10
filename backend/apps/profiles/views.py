from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

from .models import Profile, Follow
from .serializers import ProfileSerializer, PublicProfileSerializer


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)

User = get_user_model()

class PublicProfileView(generics.RetrieveAPIView):
    serializer_class = PublicProfileSerializer
    permission_classes = [AllowAny]
    lookup_field = "user_id"
    
    def get_object(self):
        user_id = self.kwargs.get("user_id")
        try:
            user = User.objects.get(id=user_id)
            profile, _ = Profile.objects.get_or_create(user=user)
            return profile
        except User.DoesNotExist:
            raise NotFound("User not found")
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)

class PublicProfileByUsernameView(APIView):
    serializer_class = PublicProfileSerializer
    permission_classes = [AllowAny]
    
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            profile, _ = Profile.objects.get_or_create(user=user)
            serializer = PublicProfileSerializer(profile)
            return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise NotFound("User not found")

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