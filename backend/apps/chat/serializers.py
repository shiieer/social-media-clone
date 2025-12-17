from rest_framework import serializers
from .models import ChatRoom, Message
from apps.accounts.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    is_read = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ["id", "room", "sender", "content", "img_url", "created_at", "is_read"]
    
    def get_is_read(self, obj):
        request = self.context.get('request')
        if request and request.user:
            # For sent messages, check if recipient has read it
            # For received messages, check if current user has read it
            if obj.sender.id == request.user.id:
                # This is a sent message, check if other participant has read it
                room = obj.room
                other_participants = room.participants.exclude(id=request.user.id)
                if other_participants.exists():
                    other_user = other_participants.first()
                    return obj.is_read_by(other_user)
            else:
                # This is a received message, check if current user has read it
                return obj.is_read_by(request.user)
        return False

class ChatRoomSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    other_participant = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ["id", "participants", "created_at", "updated_at", "messages", "last_message", "other_participant", "unread_count"]
    
    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-created_at').first()
        if last_msg:
            # Pass context to MessageSerializer for is_read field
            context = self.context if hasattr(self, 'context') else {}
            return MessageSerializer(last_msg, context=context).data
        return None
    
    def get_other_participant(self, obj):
        request = self.context.get('request')
        if request and request.user:
            other_participants = obj.participants.exclude(id=request.user.id)
            if other_participants.exists():
                return UserSerializer(other_participants.first()).data
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user:
            # Count unread messages (messages not sent by current user and not read by current user)
            unread_messages = obj.messages.exclude(sender=request.user).exclude(read_by=request.user)
            return unread_messages.count()
        return 0