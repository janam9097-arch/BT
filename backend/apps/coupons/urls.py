from django.urls import path
from .views import ApplyCouponView, RemoveCouponView, ValidateCouponView

urlpatterns = [
    path('apply/', ApplyCouponView.as_view(), name='coupon_apply'),
    path('remove/', RemoveCouponView.as_view(), name='coupon_remove'),
    path('validate/', ValidateCouponView.as_view(), name='coupon_validate'),
]
