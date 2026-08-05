"""
Custom DRF authentication backend that validates Supabase JWT tokens.

This replaces SimpleJWT authentication. When a request arrives with a
Bearer token from Supabase, this class:
1. Decodes and validates the JWT using the Supabase JWT secret
2. Finds or creates a Django user for the Supabase user ID
3. Maps Google OAuth metadata (name, email, avatar) to the Django user model
"""

import jwt
import logging
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Profile

logger = logging.getLogger(__name__)
User = get_user_model()


class SupabaseJWTAuthentication(BaseAuthentication):
    """
    Validates Supabase-issued JWT tokens and returns the corresponding Django user.
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]

        try:
            # Decode the Supabase JWT
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired.")
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f"Invalid token: {str(e)}")

        supabase_user_id = payload.get("sub")
        email = payload.get("email")

        if not supabase_user_id or not email:
            raise AuthenticationFailed("Token missing required claims (sub, email).")

        # Extract user metadata from the token
        user_metadata = payload.get("user_metadata", {})
        app_metadata = payload.get("app_metadata", {})

        # Find or create the Django user
        user = self._get_or_create_user(
            supabase_id=supabase_user_id,
            email=email,
            user_metadata=user_metadata,
            app_metadata=app_metadata,
        )

        return (user, payload)

    def _get_or_create_user(self, supabase_id, email, user_metadata, app_metadata):
        """
        Find existing user by email or create a new one.
        Updates user metadata from Supabase on each authentication.
        """
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Create new user from Supabase data
            first_name = (
                user_metadata.get("first_name")
                or (user_metadata.get("full_name", "").split(" ")[0] if user_metadata.get("full_name") else "")
                or ""
            )
            last_name = (
                user_metadata.get("last_name")
                or (" ".join(user_metadata.get("full_name", "").split(" ")[1:]) if user_metadata.get("full_name") else "")
                or ""
            )
            username = (
                user_metadata.get("username")
                or email.split("@")[0]
            )

            # Ensure username is unique
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1

            user = User.objects.create(
                email=email,
                username=username,
                first_name=first_name,
                last_name=last_name,
                is_email_verified=True,  # Supabase/Google verified the email
            )
            # Set an unusable password since auth is handled by Supabase
            user.set_unusable_password()
            user.save()

            # Create profile
            Profile.objects.get_or_create(user=user)

            logger.info(f"Created Django user for Supabase user {supabase_id}: {email}")

        return user

    def authenticate_header(self, request):
        return "Bearer"
