from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile, Address

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = [ProfileInline]
    list_display = ['email', 'username', 'first_name', 'last_name', 'is_staff', 'is_email_verified']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['email']

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'city', 'state', 'country', 'is_default']
    search_fields = ['full_name', 'city', 'user__email']
