from django.db import models
from django.conf import settings
from apps.products.models import Product, ProductVariant

class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='carts'
    )
    session_key = models.CharField(max_length=255, blank=True, null=True)
    coupon = models.ForeignKey('coupons.Coupon', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart {self.id} ({self.user.email if self.user else self.session_key})"

    @property
    def subtotal(self):
        return sum(item.total_price for item in self.items.all())

    @property
    def discount_amount(self):
        if not self.coupon or not self.coupon.is_valid():
            return 0
        return self.coupon.calculate_discount(self.subtotal)

    @property
    def tax_amount(self):
        # 5% tax rule
        discounted_subtotal = max(0, float(self.subtotal) - float(self.discount_amount))
        return round(discounted_subtotal * 0.05, 2)

    @property
    def shipping_cost(self):
        if self.subtotal >= 100 or self.items.count() == 0:
            return 0
        return 10.00

    @property
    def grand_total(self):
        return round(float(self.subtotal) - float(self.discount_amount) + float(self.tax_amount) + float(self.shipping_cost), 2)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.title}"

    @property
    def unit_price(self):
        if self.variant and self.variant.price_override:
            return self.variant.price_override
        return self.product.current_price

    @property
    def total_price(self):
        return self.unit_price * self.quantity
