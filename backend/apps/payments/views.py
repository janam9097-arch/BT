import uuid
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Payment
from apps.orders.models import Order

class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        payment_method = request.data.get('payment_method', 'COD').upper()

        order = Order.objects.filter(id=order_id, user=request.user).first()
        if not order:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if payment_method == 'COD':
            payment = Payment.objects.create(
                order=order,
                transaction_id=f"COD-{uuid.uuid4().hex[:8].upper()}",
                payment_method='COD',
                amount=order.grand_total,
                status='SUCCESS'
            )
            order.payment_status = 'COMPLETED'
            order.save()
            return Response({
                'payment_id': payment.id,
                'status': 'SUCCESS',
                'message': 'Cash on Delivery selected. Order confirmed.'
            })

        # Mock Stripe / Razorpay intent generation
        client_secret = f"mock_{payment_method.lower()}_secret_{uuid.uuid4().hex[:16]}"
        payment = Payment.objects.create(
            order=order,
            transaction_id=f"TXN-{uuid.uuid4().hex[:12].upper()}",
            payment_method=payment_method,
            amount=order.grand_total,
            status='PENDING'
        )
        return Response({
            'payment_id': payment.id,
            'client_secret': client_secret,
            'payment_method': payment_method,
            'amount': str(order.grand_total)
        })

class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get('payment_id')
        transaction_id = request.data.get('transaction_id')
        payment_status = request.data.get('status', 'SUCCESS')

        payment = Payment.objects.filter(id=payment_id, order__user=request.user).first()
        if not payment:
            return Response({'error': 'Payment record not found.'}, status=status.HTTP_404_NOT_FOUND)

        payment.status = 'SUCCESS' if payment_status == 'SUCCESS' else 'FAILED'
        if transaction_id:
            payment.transaction_id = transaction_id
        payment.save()

        order = payment.order
        if payment.status == 'SUCCESS':
            order.payment_status = 'COMPLETED'
            order.save()

        return Response({
            'status': payment.status,
            'order_id': order.id,
            'order_number': order.order_number
        })
