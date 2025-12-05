from rest_framework import serializers
from .models import Post, PostImage, Like, Comment, SavedPost

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ["id", "img_url", "position"]
    
class PostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(source="like_set.count", read_only=True)
    comments_count = serializers.IntegerField(source="comment_set.count", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id", "caption", "user", "location", "created_at", 
            "images", "likes_count", "comments_count"
        ]

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"