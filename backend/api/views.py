from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django_filters.rest_framework import DjangoFilterBackend
from .models import FoodItem, UserPreference, Favorite, RecommendationHistory
from .serializers import (
    FoodItemSerializer, UserPreferenceSerializer, 
    FavoriteSerializer, RecommendationHistorySerializer, UserSerializer
)
from .services.preference_parser import parse_user_query
from .services.recommendation_engine import generate_recommendations
from .services.ollama_service import generate_explanation
from .services.gemini_service import analyze_facial_expression

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        
    user = User.objects.create_user(username=username, password=password, email=email)
    UserPreference.objects.create(user=user)
    token, _ = Token.objects.get_or_create(user=user)
    
    return Response({'token': token.key, 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user': UserSerializer(user).data})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_preferences(request):
    pref, _ = UserPreference.objects.get_or_create(user=request.user)
    serializer = UserPreferenceSerializer(pref, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FoodItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {
        'category': ['exact'],
        'diet_type': ['exact'],
        'price': ['lte'],
        'preparation_time': ['lte'],
        'is_available': ['exact']
    }
    search_fields = ['name', 'description']

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.AllowAny] # Allow dev access

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Favorite.objects.filter(user=self.request.user)
        return Favorite.objects.all()

    def perform_create(self, serializer):
        food_id = self.request.data.get('food_id')
        try:
            food = FoodItem.objects.get(id=food_id)
            user = self.request.user if self.request.user.is_authenticated else None
            serializer.save(user=user, food=food)
        except FoodItem.DoesNotExist:
            raise serializers.ValidationError({"error": "Food item not found."})

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_recommendation_history(request):
    if request.user.is_authenticated:
        history = RecommendationHistory.objects.filter(user=request.user).order_by('-created_at')
    else:
        history = RecommendationHistory.objects.order_by('-created_at')[:10]
    serializer = RecommendationHistorySerializer(history, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def analyze_mood(request):
    """
    Receives captured webcam frame base64, invokes Gemini Vision API in backend,
    and returns detected visible facial expression / mood signal.
    """
    base64_image = request.data.get('image_base64', '')
    result = analyze_facial_expression(base64_image)
    return Response(result)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def get_recommendations(request):
    query = request.data.get('query', '')
    mood = request.data.get('mood')
    mood_confidence = request.data.get('mood_confidence')
    
    if not query and not mood:
        query = "I have ₹80 and 15 minutes, suggest something spicy"

    preferences = parse_user_query(query, facial_mood=mood)
    
    budget = preferences.get('budget')
    if budget is not None and budget <= 0:
        return Response({'error': 'Budget must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)
        
    all_foods = list(FoodItem.objects.all())
    recommendations_raw = generate_recommendations(preferences, all_foods)
    
    if not recommendations_raw:
        return Response({
            "message": "No food matches all your requirements.",
            "recommendation": None,
            "alternatives": []
        }, status=status.HTTP_200_OK)
        
    best_raw = recommendations_raw[0]
    
    explanation = generate_explanation(
        str(best_raw['items']), 
        str(preferences), 
        query
    )
    
    reasons = best_raw.get('reasons', [])
    if explanation:
        reasons.insert(0, explanation)

    # Convert best_raw to standard Recommendation format for React Frontend
    items_objs = [FoodItem.objects.get(id=it['id']) for it in best_raw['items']]
    primary_food_obj = FoodItemSerializer(items_objs[0]).data
    side_food_obj = FoodItemSerializer(items_objs[1]).data if len(items_objs) > 1 else None

    target_budget = preferences.get('budget') or 80
    formatted_primary = {
        "id": f"rec-django-{best_raw['items'][0]['id']}",
        "title": f"{items_objs[0].name} + {items_objs[1].name}" if side_food_obj else items_objs[0].name,
        "primaryFood": primary_food_obj,
        "sideFood": side_food_obj,
        "totalPrice": int(best_raw['total_price']),
        "savings": max(0, int(target_budget - best_raw['total_price'])),
        "matchScore": min(99, int(best_raw['match_score'] * 1.25)), # scale to percentage
        "badges": [f"✓ {r}" for r in reasons[:3]],
        "explanation": f"Since you have ₹{target_budget} budget and requested food, {items_objs[0].name} is your best choice.",
        "reasoningDetails": reasons,
        "prepTimeTotal": int(best_raw['preparation_time']),
        "isFavorite": False
    }

    # Format Alternatives
    alts_raw = recommendations_raw[1:4] if len(recommendations_raw) > 1 else []
    formatted_alts = []
    for alt in alts_raw:
        alt_items = [FoodItem.objects.get(id=it['id']) for it in alt['items']]
        p_obj = FoodItemSerializer(alt_items[0]).data
        s_obj = FoodItemSerializer(alt_items[1]).data if len(alt_items) > 1 else None
        formatted_alts.append({
            "id": f"alt-django-{alt_items[0].id}",
            "title": f"{alt_items[0].name} + {alt_items[1].name}" if s_obj else alt_items[0].name,
            "primaryFood": p_obj,
            "sideFood": s_obj,
            "totalPrice": int(alt['total_price']),
            "savings": max(0, int(target_budget - alt['total_price'])),
            "matchScore": min(98, int(alt['match_score'] * 1.2)),
            "badges": ["✓ Within budget", f"✓ {alt['preparation_time']} min prep"],
            "explanation": f"Alternative choice within ₹{target_budget}.",
            "reasoningDetails": alt.get('reasons', []),
            "prepTimeTotal": int(alt['preparation_time'])
        })

    # Record history
    user_to_save = request.user if request.user.is_authenticated else None
    RecommendationHistory.objects.create(
        user=user_to_save,
        query=query,
        preferences=preferences,
        recommendations=recommendations_raw[:5]
    )
        
    return Response({
        "parsed_preferences": preferences,
        "recommendation": formatted_primary,
        "alternatives": formatted_alts,
        "thinkingSteps": [
            f"Query parsed: '{query}'",
            f"Factored in mood: {preferences.get('mood', 'NEUTRAL')}",
            f"Queried official SQLite database ({len(all_foods)} food items)",
            f"Evaluated meal combinations under ₹{target_budget}",
            f"Ranked results by deterministic score"
        ]
    })
