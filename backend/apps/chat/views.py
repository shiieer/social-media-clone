from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer

class CreateRoomView(APIView):
    def post(self, request):
        room = ChatRoom.objects.create()
        return Response(ChatRoomSerializer(room).data)
    
class SendMassageView(APIView):
    def post(self, request, room_id):
        room = ChatRoom.objects.get(id=room_id)
        txt = request.data.get("content", "")
        img = request.data.get("img_url", None)

        msg = Message.objects.create(
            room=room, sender=request.user, content=txt, img_url=img
        )
        return Response(MessageSerializer(msg).data)
