from rest_framework import serializers
from .models import FoodItem, UserPreference, Favorite, RecommendationHistory
from django.contrib.auth.models import User

DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'

FOOD_IMAGES = {
    "Chicken Roll": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
    "Egg Roll": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    "Veg Roll": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    "Masala Dosa": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
    "Idli Sambar": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    "Veg Noodles": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
    "Chicken Biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    "Paneer Rice": "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80",
    "Samosa": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    "Masala Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    "Sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
    "Cold Coffee": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    "Lemon Juice": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    "Tea": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    "Fruit Bowl": "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=600&q=80",
}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class FoodItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    prepTime = serializers.IntegerField(source='preparation_time', read_only=True)

    class Meta:
        model = FoodItem
        fields = '__all__'

    def get_image(self, obj):
        if obj.image_url:
            return obj.image_url
        return FOOD_IMAGES.get(obj.name, DEFAULT_FOOD_IMAGE)

class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = '__all__'
        read_only_fields = ['user']

class FavoriteSerializer(serializers.ModelSerializer):
    food_detail = FoodItemSerializer(source='food', read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'food', 'food_detail', 'created_at']
        read_only_fields = ['user']

class RecommendationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationHistory
        fields = '__all__'
        read_only_fields = ['user']

