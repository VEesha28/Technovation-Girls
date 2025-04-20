from django.urls import path
from .views import api_translate

urlpatterns = [
    path('translate/', api_translate),
]
