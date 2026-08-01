from django.contrib import admin
from .models import Coupon

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_percentage', 'fixed_discount', 'min_purchase', 'valid_from', 'valid_to', 'is_active', 'used_count']
    search_fields = ['code']
    list_filter = ['is_active', 'valid_from', 'valid_to']
