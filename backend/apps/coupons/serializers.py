from rest_framework import serializers
from .models import Coupon

class CouponSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_percentage', 'fixed_discount', 'min_purchase', 'valid_from', 'valid_to', 'is_active', 'is_valid']
