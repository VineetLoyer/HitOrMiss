from flask import Blueprint, jsonify, request
from app.ml_service import ModelService
from app.data_service import DataService
import os

api_bp = Blueprint('api', __name__)

# Initialize services
# Get the backend directory path
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Resolve paths relative to backend directory
def resolve_path(path):
    """Resolve path relative to backend directory if not absolute"""
    if os.path.isabs(path):
        return path
    # Try the path as-is first
    if os.path.exists(path):
        return path
    # Try relative to backend directory
    backend_relative = os.path.join(BACKEND_DIR, path)
    if os.path.exists(backend_relative):
        return backend_relative
    # Return the backend-relative path as default
    return backend_relative

MODEL_PATH = resolve_path(os.getenv('MODEL_PATH', 'models/model.pkl'))
SCALER_PATH = resolve_path(os.getenv('SCALER_PATH', 'models/scaler.pkl'))
GENRE_ENCODER_PATH = resolve_path(os.getenv('GENRE_ENCODER_PATH', 'models/genre_encoder.pkl'))
DATASET_PATH = resolve_path(os.getenv('DATASET_PATH', 'data/dataset.csv'))

# Global service instances (initialized on first use)
_model_service = None
_data_service = None

def get_model_service():
    """Get or initialize the model service"""
    global _model_service
    if _model_service is None:
        _model_service = ModelService(MODEL_PATH, SCALER_PATH, GENRE_ENCODER_PATH)
    return _model_service

def get_data_service():
    """Get or initialize the data service"""
    global _data_service
    if _data_service is None:
        _data_service = DataService(DATASET_PATH)
    return _data_service

def validate_track_features(data):
    """
    Validate incoming track features
    
    Args:
        data: Request data dictionary
        
    Returns:
        Tuple of (is_valid, error_message, validated_features)
    """
    required_features = [
        'tempo', 'energy', 'danceability', 'loudness', 'valence',
        'acousticness', 'instrumentalness', 'liveness', 'speechiness',
        'duration_ms', 'key', 'mode', 'time_signature'
    ]
    
    # Define acceptable ranges for each feature
    feature_ranges = {
        'tempo': (0, 250),
        'energy': (0.0, 1.0),
        'danceability': (0.0, 1.0),
        'loudness': (-60, 0),
        'valence': (0.0, 1.0),
        'acousticness': (0.0, 1.0),
        'instrumentalness': (0.0, 1.0),
        'liveness': (0.0, 1.0),
        'speechiness': (0.0, 1.0),
        'duration_ms': (0, 10000000),  # ~2.7 hours max
        'key': (0, 11),
        'mode': (0, 1),
        'time_signature': (3, 7)
    }
    
    validated_features = {}
    
    # Check for missing required features
    for feature in required_features:
        if feature not in data:
            return False, f"Missing required feature: {feature}", None
        
        value = data[feature]
        
        # Check if value is numeric
        try:
            value = float(value)
        except (ValueError, TypeError):
            return False, f"Invalid value for {feature}: must be numeric", None
        
        # Check if value is within acceptable range
        min_val, max_val = feature_ranges[feature]
        if not (min_val <= value <= max_val):
            return False, f"Invalid value for {feature}: must be between {min_val} and {max_val}", None
        
        validated_features[feature] = value
    
    return True, None, validated_features

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "API is running"}), 200

@api_bp.route('/predict', methods=['POST'])
def predict():
    """Predict if a track will be a hit or miss"""
    try:
        # Get request data
        data = request.get_json(silent=True)
        
        if data is None:
            return jsonify({
                "error": {
                    "code": "INVALID_REQUEST",
                    "message": "Request body must be JSON"
                }
            }), 400
        
        # Validate track features
        is_valid, error_message, validated_features = validate_track_features(data)
        
        if not is_valid:
            return jsonify({
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": error_message
                }
            }), 400
        
        # Get model service and generate prediction
        model_service = get_model_service()
        prediction_result = model_service.predict(validated_features)
        
        return jsonify(prediction_result), 200
        
    except RuntimeError as e:
        # Model loading or prediction errors
        return jsonify({
            "error": {
                "code": "MODEL_ERROR",
                "message": "Failed to generate prediction"
            }
        }), 500
    except Exception as e:
        # Unexpected errors
        return jsonify({
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred"
            }
        }), 500

@api_bp.route('/similar', methods=['POST'])
def similar_tracks():
    """Find similar tracks"""
    try:
        # Get request data
        data = request.get_json(silent=True)
        
        if data is None:
            return jsonify({
                "error": {
                    "code": "INVALID_REQUEST",
                    "message": "Request body must be JSON"
                }
            }), 400
        
        # Extract features (can be nested under 'features' key or at root level)
        features = data.get('features', data)
        
        # Validate track features
        is_valid, error_message, validated_features = validate_track_features(features)
        
        if not is_valid:
            return jsonify({
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": error_message
                }
            }), 400
        
        # Get number of recommendations (default 5, between 3 and 10)
        n_recommendations = data.get('n_recommendations', 5)
        try:
            n_recommendations = int(n_recommendations)
            n_recommendations = max(3, min(10, n_recommendations))
        except (ValueError, TypeError):
            n_recommendations = 5
        
        # Get data service and find similar tracks
        data_service = get_data_service()
        similar_tracks_list = data_service.find_similar_tracks(validated_features, n_recommendations)
        
        return jsonify({
            "similar_tracks": similar_tracks_list
        }), 200
        
    except RuntimeError as e:
        # Dataset loading errors
        return jsonify({
            "error": {
                "code": "DATA_ERROR",
                "message": "Failed to load dataset"
            }
        }), 500
    except Exception as e:
        # Unexpected errors
        return jsonify({
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred"
            }
        }), 500

@api_bp.route('/eda-data', methods=['GET'])
def eda_data():
    """Get exploratory data analysis data"""
    try:
        # Get data service and generate EDA data
        data_service = get_data_service()
        eda_result = data_service.get_eda_data()
        
        return jsonify(eda_result), 200
        
    except RuntimeError as e:
        # Dataset loading errors
        return jsonify({
            "error": {
                "code": "DATA_ERROR",
                "message": "Failed to load dataset for EDA"
            }
        }), 500
    except Exception as e:
        # Unexpected errors
        return jsonify({
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred"
            }
        }), 500
