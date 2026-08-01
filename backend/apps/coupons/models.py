from django.db import models
from django.utils import timezone

class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    fixed_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    min_purchase = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valid_from = models.DateTimeField(default=timezone.now)
    valid_to = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    max_uses = models.PositiveIntegerField(default=100)
    used_count = models.PositiveIntegerField(default=0)

    def is_valid(self):
        now = timezone.now()
        if not self.is_active:
            return False
        if self.valid_to and now > self.valid_to:
            return False
        if now < self.valid_from:
            return False
        if self.used_count >= self.max_uses:
            return False
        return True

    def calculate_discount(self, subtotal):
        if float(subtotal) < float(self.min_purchase):
            return 0
        if self.discount_percentage > 0:
            return round(float(subtotal) * (float(self.discount_percentage) / 100.0), 2)
        return min(float(subtotal), float(self.fixed_discount))

    def __str__(self):
        return self.code
