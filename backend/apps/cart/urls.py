from django.urls import path
from .views import (
    CartView, AddToCartView, UpdateCartItemView,
    RemoveFromCartView, ClearCartView
)
from apps.coupons.views import ApplyCouponView

urlpatterns = [
    path('', CartView.as_view(), name='cart_detail'),
    path('add/', AddToCartView.as_view(), name='cart_add'),
    path('add_item/', AddToCartView.as_view(), name='cart_add_item'),
    path('update/<int:item_id>/', UpdateCartItemView.as_view(), name='cart_update'),
    path('remove/<int:item_id>/', RemoveFromCartView.as_view(), name='cart_remove'),
    path('clear/', ClearCartView.as_view(), name='cart_clear'),
    path('apply_coupon/', ApplyCouponView.as_view(), name='cart_apply_coupon'),
]
