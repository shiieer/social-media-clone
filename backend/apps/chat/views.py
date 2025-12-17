from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from apps.accounts.models import User
from apps.accounts.serializers import UserSerializer

class ListChatRoomsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get all chat rooms where user is a participant
        rooms = ChatRoom.objects.filter(participants=request.user)
        
        # Exclude rooms that have admin users as participants (if current user is not admin)
        if not request.user.is_superuser and not request.user.is_staff:
            # Get admin user IDs
            admin_ids = User.objects.filter(
                is_superuser=True
            ).values_list('id', flat=True) | User.objects.filter(
                is_staff=True
            ).values_list('id', flat=True)
            
            # Exclude rooms that have admin as participants
            rooms = rooms.exclude(participants__id__in=admin_ids)
        
        serializer = ChatRoomSerializer(rooms, many=True, context={'request': request})
        return Response(serializer.data)

class GetOrCreateRoomView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user_id = request.data.get("user_id")
        if not user_id:
            return Response(
                {"error": "user_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            other_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if other_user.id == request.user.id:
            return Response(
                {"error": "Cannot create room with yourself"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prevent non-admin users from creating rooms with admin users
        if not request.user.is_superuser and not request.user.is_staff:
            if other_user.is_superuser or other_user.is_staff:
                return Response(
                    {"error": "Cannot create room with admin user"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Check if room already exists between these two users
        existing_room = ChatRoom.objects.filter(
            participants=request.user
        ).filter(
            participants=other_user
        ).distinct()
        
        # Filter rooms that have exactly 2 participants
        for room in existing_room:
            if room.participants.count() == 2:
                serializer = ChatRoomSerializer(room, context={'request': request})
                return Response(serializer.data)
        
        # Create new room
        room = ChatRoom.objects.create()
        room.participants.add(request.user, other_user)
        serializer = ChatRoomSerializer(room, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class GetRoomMessagesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, room_id):
        room = get_object_or_404(ChatRoom, id=room_id)
        
        # Check if user is a participant
        if not room.participants.filter(id=request.user.id).exists():
            return Response(
                {"error": "You are not a participant of this room"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Optional: Get messages after a specific message ID (for optimization)
        last_message_id = request.query_params.get('after', None)
        if last_message_id:
            try:
                messages = room.messages.filter(id__gt=last_message_id).order_by('created_at')
            except ValueError:
                # If last_message_id is invalid, get all messages
                messages = room.messages.order_by('created_at')
        else:
            messages = room.messages.order_by('created_at')
        
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)

class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, room_id):
        room = get_object_or_404(ChatRoom, id=room_id)
        
        # Check if user is a participant
        if not room.participants.filter(id=request.user.id).exists():
            return Response(
                {"error": "You are not a participant of this room"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        txt = request.data.get("content", "")
        img = request.data.get("img_url", None)

        if not txt and not img:
            return Response(
                {"error": "Content or img_url is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        msg = Message.objects.create(
            room=room, sender=request.user, content=txt, img_url=img
        )
        
        # Update room's updated_at by saving it
        room.save()
        
        serializer = MessageSerializer(msg, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MarkMessagesAsReadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, room_id):
        room = get_object_or_404(ChatRoom, id=room_id)
        
        # Check if user is a participant
        if not room.participants.filter(id=request.user.id).exists():
            return Response(
                {"error": "You are not a participant of this room"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get message IDs to mark as read (optional, if not provided, mark all unread messages in room)
        message_ids = request.data.get("message_ids", None)
        
        if message_ids:
            # Mark specific messages as read
            messages = Message.objects.filter(
                id__in=message_ids,
                room=room
            ).exclude(sender=request.user)  # Only mark received messages as read
        else:
            # Mark all unread messages in room as read
            messages = Message.objects.filter(
                room=room
            ).exclude(sender=request.user).exclude(read_by=request.user)
        
        # Mark messages as read
        for message in messages:
            if not message.is_read_by(request.user):
                message.read_by.add(request.user)
        
        return Response({
            "success": True,
            "marked_count": messages.count()
        }, status=status.HTTP_200_OK)

class SuggestedUsersView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get all users except current user and admin users
        # Exclude superusers and staff (admin accounts)
        all_users = User.objects.exclude(id=request.user.id).exclude(
            is_superuser=True
        ).exclude(is_staff=True)
        
        # Get users that current user already has chat rooms with
        existing_rooms = ChatRoom.objects.filter(participants=request.user)
        users_with_chats = User.objects.filter(
            chat_rooms__in=existing_rooms
        ).exclude(id=request.user.id).distinct()
        
        # Get suggested users (users without existing chats)
        suggested_users = all_users.exclude(id__in=users_with_chats.values_list('id', flat=True))
        
        # Limit to 50 users
        suggested_users = suggested_users[:50]
        
        serializer = UserSerializer(suggested_users, many=True)
        return Response(serializer.data)
