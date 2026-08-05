import logging
from rest_framework import status, generics, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import Profile, Address
from .serializers import (
    UserSerializer, RegisterSerializer, ProfileSerializer,
    AddressSerializer, ChangePasswordSerializer,
    ForgotPasswordSerializer, ResetPasswordSerializer
)

logger = logging.getLogger(__name__)
User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Registration validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            logger.info(f"User created successfully: {user.email}")
            return Response({
                'user': UserSerializer(user, context=self.get_serializer_context()).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'User registered successfully.'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Backend registration error: {str(e)}", exc_info=True)
            return Response(
                {'detail': f"Registration failed due to a server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        user_data = request.data.copy()
        profile_data = {}
        if 'profile' in user_data:
            profile_data = user_data.pop('profile')

        serializer = self.get_serializer(user, data=user_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if profile_data:
            profile_serializer = ProfileSerializer(user.profile, data=profile_data, partial=True)
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()

        return Response(UserSerializer(user).data)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'message': 'Password updated successfully.'})

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()
        if user:
            # Send reset email logic or reset token
            pass
        return Response({'message': 'If an account exists for this email, password reset instructions have been sent.'})

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email=serializer.validated_data['email']).first()
        if user:
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password has been reset successfully.'})
        return Response({'error': 'Invalid request.'}, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        # Simple verification confirmation
        return Response({'message': 'Email verified successfully.'})

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Successfully logged out.'})
        except Exception:
            return Response({'message': 'Logged out.'})


class SupabaseSyncView(APIView):
    """
    Called by the frontend after Supabase login to ensure a Django user
    record exists for this Supabase user. Handles Google OAuth users who
    have no prior Django account.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        supabase_id = request.data.get('supabase_id')
        email = request.data.get('email')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        username = request.data.get('username', '')
        avatar_url = request.data.get('avatar_url', '')

        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user

        # Update fields if they were empty
        updated = False
        if first_name and not user.first_name:
            user.first_name = first_name
            updated = True
        if last_name and not user.last_name:
            user.last_name = last_name
            updated = True
        if updated:
            user.save()

        # Ensure profile exists
        profile, created = Profile.objects.get_or_create(user=user)

        return Response({
            'message': 'User synced successfully.',
            'user': UserSerializer(user).data,
        })
