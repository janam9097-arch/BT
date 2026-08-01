from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from apps.notifications.views import subscribe_newsletter, submit_contact_message

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        "status": "success",
        "message": "E-Commerce API Service Operational",
        "endpoints": {
            "auth": "/api/auth/",
            "users": "/api/users/",
            "categories": "/api/categories/",
            "products": "/api/products/",
            "cart": "/api/cart/",
            "wishlist": "/api/wishlist/",
            "orders": "/api/orders/",
            "payments": "/api/payments/",
            "reviews": "/api/reviews/",
            "coupons": "/api/coupons/",
            "notifications": "/api/notifications/",
            "newsletter_subscribe": "/api/newsletter/subscribe/",
            "contact_submit": "/api/contact/",
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    path('api/auth/', include('apps.users.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/categories/', include('apps.categories.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/cart/', include('apps.cart.urls')),
    path('api/wishlist/', include('apps.wishlist.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/coupons/', include('apps.coupons.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/newsletter/subscribe/', subscribe_newsletter, name='newsletter_subscribe'),
    path('api/contact/', submit_contact_message, name='contact_submit'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
