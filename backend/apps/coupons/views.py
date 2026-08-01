from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Coupon
from .serializers import CouponSerializer
from apps.cart.models import Cart
from apps.cart.serializers import CartSerializer

def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        session_key = request.session.session_key or request.session.create()
        cart, _ = Cart.objects.get_or_create(session_key=request.session.session_key)
    return cart

class ApplyCouponView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code', '').strip()
        coupon = Coupon.objects.filter(code__iexact=code).first()
        if not coupon or not coupon.is_valid():
            return Response({'error': 'Invalid or expired coupon code.'}, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request)
        if float(cart.subtotal) < float(coupon.min_purchase):
            return Response(
                {'error': f'Minimum purchase of ${coupon.min_purchase} required for this coupon.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart.coupon = coupon
        cart.save()
        return Response({
            'message': 'Coupon applied successfully.',
            'cart': CartSerializer(cart).data
        })

class RemoveCouponView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        cart.coupon = None
        cart.save()
        return Response({
            'message': 'Coupon removed.',
            'cart': CartSerializer(cart).data
        })

class ValidateCouponView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code', '').strip()
        coupon = Coupon.objects.filter(code__iexact=code).first()
        if not coupon or not coupon.is_valid():
            return Response({'is_valid': False, 'message': 'Invalid or expired coupon.'})
        return Response({'is_valid': True, 'coupon': CouponSerializer(coupon).data})
