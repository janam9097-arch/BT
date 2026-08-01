from django.urls import path
from .views import WishlistView, AddToWishlistView, RemoveFromWishlistView

urlpatterns = [
    path('', WishlistView.as_view(), name='wishlist_list'),
    path('add/', AddToWishlistView.as_view(), name='wishlist_add'),
    path('remove/', RemoveFromWishlistView.as_view(), name='wishlist_remove_body'),
    path('remove/<int:product_id>/', RemoveFromWishlistView.as_view(), name='wishlist_remove'),
]
