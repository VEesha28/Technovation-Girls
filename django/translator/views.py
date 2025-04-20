from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from googletrans import Translator
from .serializers import TranslateSerializer

@api_view(['POST'])
def api_translate(request):
    serializer = TranslateSerializer(data=request.data)

    if serializer.is_valid():
        source_text = serializer.validated_data['source_text']
        source_lang = serializer.validated_data['source_lang']
        target_lang = serializer.validated_data['target_lang']

        try:
            # using googletrans translator
            translator = Translator()
            translation = translator.translate(
                source_text, src=source_lang, dest=target_lang
            )
            return Response({'translated_text': translation.text})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
