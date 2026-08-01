from rest_framework import status, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from apps.cart.models import Cart
from apps.notifications.models import Notification

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response({'error': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=request.user,
            shipping_name=data['shipping_name'],
            shipping_phone=data['shipping_phone'],
            shipping_address=data['shipping_address'],
            shipping_city=data['shipping_city'],
            shipping_state=data['shipping_state'],
            shipping_postal_code=data['shipping_postal_code'],
            shipping_country=data['shipping_country'],
            payment_method=data['payment_method'],
            payment_status='COMPLETED' if data['payment_method'] != 'COD' else 'PENDING',
            subtotal=cart.subtotal,
            tax_amount=cart.tax_amount,
            shipping_cost=cart.shipping_cost,
            discount_amount=cart.discount_amount,
            grand_total=cart.grand_total
        )

        for item in cart.items.all():
            img_url = item.product.images.first().get_url() if item.product.images.exists() else ''
            OrderItem.objects.create(
                order=order,
                product=item.product,
                variant=item.variant,
                product_name=item.product.title,
                product_image=img_url,
                price=item.unit_price,
                quantity=item.quantity
            )

        # Clear cart after ordering
        cart.items.all().delete()
        cart.coupon = None
        cart.save()

        # Send in-app notification
        Notification.objects.create(
            user=request.user,
            title="Order Placed Successfully",
            message=f"Your order #{order.order_number} has been placed successfully!"
        )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status in ['SHIPPED', 'DELIVERED']:
            return Response({'error': 'Order cannot be cancelled after shipping.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'CANCELLED'
        order.save()
        return Response({'message': 'Order has been cancelled.', 'order': OrderSerializer(order).data})

    @action(detail=True, methods=['post'], url_path='return')
    def return_order(self, request, pk=None):
        order = self.get_object()
        if order.status != 'DELIVERED':
            return Response({'error': 'Only delivered orders can be returned.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'RETURNED'
        order.save()
        return Response({'message': 'Return request submitted.', 'order': OrderSerializer(order).data})
