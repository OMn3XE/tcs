import re
from .ollama_service import extract_preferences as ollama_extract

def parse_user_query(query, facial_mood=None):
    # Try Ollama first
    preferences = ollama_extract(query)
    
    if preferences is None:
        # Fallback to regex / string matching if Ollama is not running
        preferences = fallback_parse(query)

    # Attach facial mood signal if available and text query didn't specify explicit mood
    if facial_mood and not preferences.get("mood"):
        preferences["mood"] = facial_mood.upper()

    return preferences

def fallback_parse(query):
    query_lower = query.lower()
    
    preferences = {
        "budget": None,
        "diet_type": None,
        "spice_level": None,
        "mood": None,
        "max_preparation_time": None,
        "category": None,
        "health_goal": None
    }
    
    # Budget parsing: e.g., ₹80, rs 80, 80 rupees, 80rs, under 50
    budget_match = re.search(r'(?:₹|rs\.?\s*|rupees\s*|under\s*|max\s*)(\d+)|(\d+)\s*(?:rs|rupees|bucks|₹)', query_lower)
    if budget_match:
        val = budget_match.group(1) or budget_match.group(2)
        preferences["budget"] = int(val)
        
    # Diet type parsing
    if 'vegan' in query_lower:
        preferences["diet_type"] = 'VEGAN'
    elif 'non-veg' in query_lower or 'non veg' in query_lower or 'chicken' in query_lower or 'egg' in query_lower or 'meat' in query_lower:
        preferences["diet_type"] = 'NON_VEG'
    elif 'veg' in query_lower or 'vegetarian' in query_lower:
        preferences["diet_type"] = 'VEG'
        
    # Spice level
    if 'spicy' in query_lower or 'hot' in query_lower or 'chili' in query_lower:
        preferences["spice_level"] = 'SPICY'
    elif 'medium' in query_lower:
        preferences["spice_level"] = 'MEDIUM'
    elif 'mild' in query_lower or 'not spicy' in query_lower:
        preferences["spice_level"] = 'MILD'
        
    # Time parsing: e.g., 15 minutes, 15 min, 15 mins, quick, fast
    time_match = re.search(r'(\d+)\s*(?:min|mins|minute|minutes)', query_lower)
    if time_match:
        preferences["max_preparation_time"] = int(time_match.group(1))
    elif any(kw in query_lower for kw in ['quick', 'fast', 'hurry']):
        preferences["max_preparation_time"] = 10
        
    # Mood
    if 'hungry' in query_lower or 'starving' in query_lower or 'filling' in query_lower:
        preferences["mood"] = 'HUNGRY'
    elif 'angry' in query_lower or 'stressed' in query_lower:
        preferences["mood"] = 'ANGRY'
    elif 'happy' in query_lower:
        preferences["mood"] = 'HAPPY'
    elif 'healthy' in query_lower:
        preferences["mood"] = 'HEALTHY'
        
    return preferences
