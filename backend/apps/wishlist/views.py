from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Wishlist
from .serializers import WishlistSerializer
from apps.products.models import Product

class WishlistView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

class AddToWishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        product = Product.objects.filter(id=product_id, is_active=True).first()
        if not product:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        if created:
            return Response(WishlistSerializer(item).data, status=status.HTTP_201_CREATED)
        return Response({'message': 'Product already in wishlist.'}, status=status.HTTP_200_OK)

class RemoveFromWishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, product_id):
        Wishlist.objects.filter(user=request.user, product_id=product_id).delete()
        return Response({'message': 'Item removed from wishlist.'})
