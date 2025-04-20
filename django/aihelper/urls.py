from django.urls import path
from .views import gemini_response

urlpatterns = [
    path('gemini/', gemini_response),
]
