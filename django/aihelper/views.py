from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def gemini_response(request):
    prompt = request.data.get('prompt')  #setting the var = to the given prompt
    if prompt is None:
        return Response({'error': 'Missing prompt'}, status=status.HTTP_400_BAD_REQUEST)

    # ignore the prompt for now, no ai stuff, just return hello world bc
    ai_response = "i love food >:)"
    return Response({
        'prompt_received': prompt,
        'response': ai_response,
    })
