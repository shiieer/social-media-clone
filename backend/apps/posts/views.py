from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Post, PostImage, Like, Comment, SavedPost
from .serializers import PostSerializer, CommentSerializer


class CreatedPostView(APIView):
    def post(self, request):
        user = request.user
        caption = request.data.get("caption", "")
        location = request.data.get("location", "")
        images = request.data.get("images", [])

        post = Post.objects.create(user=user, caption=caption, location=location)

        for idx, url in enumerate(images):
            PostImage.objects.create(post=post, img_url=url, position=idx)

        return Response(PostSerializer(post).data)
    
class FeedView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        user = self.request.user
        following_ids = user.following.values_list("following", flat=True)
        return Post.objects.filter(user__id__in=following_ids).order_by("-created_at")
    
class LikeToggleView(APIView):
    def post(self, request, post_id):
        user = request.user

        obj = Like.objects.filter(user=user, post_id=post_id).first()

        if obj:
            obj.delete()
            return Response({"status": "unliked"})
        
        Like.objects.create(user=user, post_id=post_id)
        return Response({"status": "liked"})
    
class SaveToggleView(APIView):
    def post(self, request, post_id):
        user = request.user

        obj = SavedPost.objects.filter(user=user, post_id=post_id).first()

        if obj:
            obj.delete()
            return Response({"status": "unsaved"})
        
        SavedPost.objects.create(user=user, post_id=post_id)
        return Response({"status": "saved"})

class AddCommentView(APIView):
    def post(self, request, post_id):
        user = request.user
        text = request.data.get("comment", "")

        if text.strip() == "":
            return Response({"error": "Comment empty"}, status=400)

        comment = Comment.objects.create(user=user, post_id=post_id, comment=text)
        return Response(CommentSerializer(comment).data)