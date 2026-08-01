from django.urls import path
from .views import CreatePaymentIntentView, VerifyPaymentView

urlpatterns = [
    path('create-intent/', CreatePaymentIntentView.as_view(), name='create_payment_intent'),
    path('verify/', VerifyPaymentView.as_view(), name='verify_payment'),
]
