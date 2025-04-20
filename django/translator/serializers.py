from rest_framework import serializers

class TranslateSerializer(serializers.Serializer):
    source_text = serializers.CharField()
    source_lang = serializers.CharField()
    target_lang = serializers.CharField()