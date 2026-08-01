from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Notification, NewsletterSubscriber, ContactMessage
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'], url_path='read-all')
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all marked as read'})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def subscribe_newsletter(request):
    email = request.data.get('email', '').strip().lower()
    if not email:
        return Response({'email': ['Email address is required.']}, status=status.HTTP_400_BAD_REQUEST)
    
    sub, created = NewsletterSubscriber.objects.get_or_create(email=email)
    if not created:
        return Response({'message': 'This email is already subscribed!'}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'message': 'Thank you for subscribing!'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def submit_contact_message(request):
    name = request.data.get('name', '').strip()
    email = request.data.get('email', '').strip().lower()
    subject = request.data.get('subject', '').strip()
    message = request.data.get('message', '').strip()

    if not name or not email or not message:
        return Response({'detail': 'Name, email, and message are required.'}, status=status.HTTP_400_BAD_REQUEST)

    msg = ContactMessage.objects.create(name=name, email=email, subject=subject, message=message)
    return Response({'message': 'Message sent successfully.', 'id': msg.id}, status=status.HTTP_201_CREATED)
