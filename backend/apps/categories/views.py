from rest_framework import viewsets, permissions
from .models import Category
from .serializers import CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True, parent__isnull=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        queryset = Category.objects.filter(is_active=True)
        all_cats = self.request.query_params.get('all', None)
        if not all_cats:
            # By default return top-level parent categories with children nested
            queryset = queryset.filter(parent__isnull=True)
        return queryset
