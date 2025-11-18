"""
Property-Based Tests for Spotify Track Predictor
Tests correctness properties using Hypothesis
"""
import pytest
from hypothesis import given, strategies as st, settings
import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.ml_service import ModelService
from app.data_service import DataService


# Test configuration
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'scaler.pkl')
GENRE_ENCODER_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'genre_encoder.pkl')
DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'dataset.csv')


# Hypothesis strategies for generating valid track features
def valid_track_features():
    """Strategy for generating valid track feature dictionaries"""
    return st.fixed_dictionaries({
        'tempo': st.floats(min_value=0, max_value=250, allow_nan=False, allow_infinity=False),
        'energy': st.floats(min_value=0.0, max_value=1.0, allow_nan=False, allow_infinity=False),
        'danceability': st.floats(min_value=0.0, max_value=1.0, allow_nan=False, allow_infinity=False),
        'loudness': st.floats(min_value=-60.0, max_value=0.0, allow_nan=False, allow_infinity=False),
        'valence': st.floats(min_value=0.0, max_value=1.0, allow_nan=False, allow_infinity=False),
        'acousticness': st.floats(min_value=0.0, max_value=1.0, allow_nan=False, allow_infinity=False),
        'instrumentalness': st.floats(min_value=0.0, max_value=1.0, allow_nan=False, allow_infinity=False),
        'liveness': st.floats(min_value=0.0, max_value=1.0, allow_nan=False, allow_infinity=False),
        'speechiness': st.floats(min_value=0.0, max_value=1.0, allow_nan=False, allow_infinity=False),
        'duration_ms': st.integers(min_value=60000, max_value=600000),
        'key': st.integers(min_value=0, max_value=11),
        'mode': st.integers(min_value=0, max_value=1),
        'time_signature': st.integers(min_value=3, max_value=7)
    })


# Fixtures
@pytest.fixture(scope="module")
def ml_service():
    """Create ML service instance for testing"""
    return ModelService(MODEL_PATH, SCALER_PATH, GENRE_ENCODER_PATH)


@pytest.fixture(scope="module")
def data_service():
    """Create data service instance for testing"""
    return DataService(DATASET_PATH)


# Property 6: Prediction output structure
# Feature: spotify-track-predictor, Property 6: Prediction output structure
# Validates: Requirements 4.2, 4.3, 4.4
@settings(max_examples=100)
@given(features=valid_track_features())
def test_property_prediction_output_structure(ml_service, features):
    """
    Property 6: Prediction output structure
    
    For any valid track feature input, when a prediction is generated,
    the result should contain exactly one of "hit" or "miss" as the
    prediction value, and a confidence score between 0.0 and 1.0.
    
    Validates: Requirements 4.2, 4.3, 4.4
    """
    # Generate prediction
    result = ml_service.predict(features)
    
    # Check that result is a dictionary
    assert isinstance(result, dict), "Prediction result must be a dictionary"
    
    # Check that prediction field exists and is either 'hit' or 'miss'
    assert 'prediction' in result, "Result must contain 'prediction' field"
    assert result['prediction'] in ['hit', 'miss'], \
        f"Prediction must be 'hit' or 'miss', got: {result['prediction']}"
    
    # Check that confidence field exists and is between 0.0 and 1.0
    assert 'confidence' in result, "Result must contain 'confidence' field"
    assert isinstance(result['confidence'], (int, float)), \
        "Confidence must be a number"
    assert 0.0 <= result['confidence'] <= 1.0, \
        f"Confidence must be between 0.0 and 1.0, got: {result['confidence']}"
    
    # Check that probabilities field exists
    assert 'probabilities' in result, "Result must contain 'probabilities' field"
    assert isinstance(result['probabilities'], dict), \
        "Probabilities must be a dictionary"
    
    # Check that probabilities contain 'hit' and 'miss' keys
    assert 'hit' in result['probabilities'], "Probabilities must contain 'hit' key"
    assert 'miss' in result['probabilities'], "Probabilities must contain 'miss' key"
    
    # Check that probability values are between 0.0 and 1.0
    assert 0.0 <= result['probabilities']['hit'] <= 1.0, \
        f"Hit probability must be between 0.0 and 1.0, got: {result['probabilities']['hit']}"
    assert 0.0 <= result['probabilities']['miss'] <= 1.0, \
        f"Miss probability must be between 0.0 and 1.0, got: {result['probabilities']['miss']}"
    
    # Check that probabilities sum to approximately 1.0 (within floating point tolerance)
    prob_sum = result['probabilities']['hit'] + result['probabilities']['miss']
    assert abs(prob_sum - 1.0) < 0.01, \
        f"Probabilities should sum to 1.0, got: {prob_sum}"


# Property 7: Similar tracks structure and count
# Feature: spotify-track-predictor, Property 7: Similar tracks structure and count
# Validates: Requirements 5.2, 5.3, 5.4
@settings(max_examples=100)
@given(
    features=valid_track_features(),
    n_recommendations=st.integers(min_value=1, max_value=15)
)
def test_property_similar_tracks_structure(data_service, features, n_recommendations):
    """
    Property 7: Similar tracks structure and count
    
    For any prediction request, when similar tracks are returned,
    the system should return between 3 and 10 tracks, and each track
    should include track_name, artist, and feature values.
    
    Validates: Requirements 5.2, 5.3, 5.4
    """
    # Find similar tracks
    similar_tracks = data_service.find_similar_tracks(features, n=n_recommendations)
    
    # Check that result is a list
    assert isinstance(similar_tracks, list), "Similar tracks must be a list"
    
    # Check that the number of tracks is between 3 and 10
    assert 3 <= len(similar_tracks) <= 10, \
        f"Number of similar tracks must be between 3 and 10, got: {len(similar_tracks)}"
    
    # Check each track has the required structure
    for i, track in enumerate(similar_tracks):
        assert isinstance(track, dict), \
            f"Track {i} must be a dictionary"
        
        # Check required fields exist
        assert 'track_name' in track, \
            f"Track {i} must contain 'track_name' field"
        assert 'artist' in track, \
            f"Track {i} must contain 'artist' field"
        assert 'similarity_score' in track, \
            f"Track {i} must contain 'similarity_score' field"
        assert 'features' in track, \
            f"Track {i} must contain 'features' field"
        
        # Check field types
        assert isinstance(track['track_name'], str), \
            f"Track {i} track_name must be a string"
        assert isinstance(track['artist'], str), \
            f"Track {i} artist must be a string"
        assert isinstance(track['similarity_score'], (int, float)), \
            f"Track {i} similarity_score must be a number"
        assert isinstance(track['features'], dict), \
            f"Track {i} features must be a dictionary"
        
        # Check similarity score is between 0.0 and 1.0
        assert 0.0 <= track['similarity_score'] <= 1.0, \
            f"Track {i} similarity_score must be between 0.0 and 1.0, got: {track['similarity_score']}"
        
        # Check that features dictionary contains expected feature keys
        expected_features = [
            'tempo', 'energy', 'danceability', 'loudness', 'valence',
            'acousticness', 'instrumentalness', 'liveness', 'speechiness',
            'duration_ms', 'key', 'mode', 'time_signature'
        ]
        for feature_name in expected_features:
            assert feature_name in track['features'], \
                f"Track {i} features must contain '{feature_name}' field"
            assert isinstance(track['features'][feature_name], (int, float)), \
                f"Track {i} feature '{feature_name}' must be a number"


# Property 4: Input validation
# Feature: spotify-track-predictor, Property 4: Input validation
# Validates: Requirements 3.3, 3.4
def generate_invalid_value_for_feature(feature_name):
    """Generate an invalid value strategy for a specific feature"""
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
        'duration_ms': (0, 10000000),
        'key': (0, 11),
        'mode': (0, 1),
        'time_signature': (3, 7)
    }
    
    min_val, max_val = feature_ranges[feature_name]
    
    # Generate values that are definitely outside the range
    return st.one_of(
        st.floats(min_value=max_val + 0.1, max_value=max_val + 1000, allow_nan=False, allow_infinity=False),  # Above max
        st.floats(min_value=min_val - 1000, max_value=min_val - 0.1, allow_nan=False, allow_infinity=False)   # Below min
    )


@settings(max_examples=100)
@given(
    feature_name=st.sampled_from([
        'tempo', 'energy', 'danceability', 'loudness', 'valence',
        'acousticness', 'instrumentalness', 'liveness', 'speechiness',
        'duration_ms', 'key', 'mode', 'time_signature'
    ]),
    data=st.data()
)
def test_property_input_validation(feature_name, data):
    """
    Property 4: Input validation
    
    For any input field and any user input value, when the value is outside
    the acceptable range for that field, the system should reject the input
    and display a validation error message.
    
    Validates: Requirements 3.3, 3.4
    """
    from app.routes import validate_track_features
    
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
        'duration_ms': (0, 10000000),
        'key': (0, 11),
        'mode': (0, 1),
        'time_signature': (3, 7)
    }
    
    # Create a valid feature set
    valid_features = {
        'tempo': 120.0,
        'energy': 0.8,
        'danceability': 0.7,
        'loudness': -5.0,
        'valence': 0.6,
        'acousticness': 0.1,
        'instrumentalness': 0.0,
        'liveness': 0.2,
        'speechiness': 0.05,
        'duration_ms': 200000,
        'key': 5,
        'mode': 1,
        'time_signature': 4
    }
    
    # Generate an invalid value for the selected feature
    invalid_value = data.draw(generate_invalid_value_for_feature(feature_name))
    
    # Get the acceptable range for the feature being tested
    min_val, max_val = feature_ranges[feature_name]
    
    # Replace one feature with an invalid value
    invalid_features = valid_features.copy()
    invalid_features[feature_name] = invalid_value
    
    # Validate the features
    is_valid, error_message, validated_features = validate_track_features(invalid_features)
    
    # Check that validation fails
    assert not is_valid, \
        f"Validation should fail for {feature_name}={invalid_value} (range: {min_val}-{max_val})"
    
    # Check that an error message is provided
    assert error_message is not None, \
        "Error message should be provided when validation fails"
    assert isinstance(error_message, str), \
        "Error message should be a string"
    assert len(error_message) > 0, \
        "Error message should not be empty"
    
    # Check that the error message mentions the problematic feature
    assert feature_name in error_message.lower(), \
        f"Error message should mention the feature '{feature_name}'"



# Property 10: Error message display
# Feature: spotify-track-predictor, Property 10: Error message display
# Validates: Requirements 8.1, 8.4, 8.5
@settings(max_examples=100)
@given(
    error_type=st.sampled_from([
        'missing_feature',
        'invalid_range',
        'non_numeric',
        'empty_body'
    ])
)
def test_property_error_message_display(error_type):
    """
    Property 10: Error message display
    
    For any error condition (prediction failure, network failure, validation error),
    the system should display a user-friendly error message that explains the problem
    without exposing technical implementation details.
    
    Validates: Requirements 8.1, 8.4, 8.5
    """
    from app import create_app
    import json
    
    app = create_app()
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        # Create different error scenarios based on error_type
        if error_type == 'missing_feature':
            # Missing required feature
            data = {
                'energy': 0.8,
                'danceability': 0.7,
                # Missing 'tempo' and other features
            }
            response = client.post(
                '/api/predict',
                data=json.dumps(data),
                content_type='application/json'
            )
        
        elif error_type == 'invalid_range':
            # Feature value outside acceptable range
            data = {
                'tempo': 120.0,
                'energy': 2.5,  # Invalid: should be 0.0-1.0
                'danceability': 0.7,
                'loudness': -5.0,
                'valence': 0.6,
                'acousticness': 0.1,
                'instrumentalness': 0.0,
                'liveness': 0.2,
                'speechiness': 0.05,
                'duration_ms': 200000,
                'key': 5,
                'mode': 1,
                'time_signature': 4
            }
            response = client.post(
                '/api/predict',
                data=json.dumps(data),
                content_type='application/json'
            )
        
        elif error_type == 'non_numeric':
            # Non-numeric value for a numeric field
            data = {
                'tempo': 'not_a_number',
                'energy': 0.8,
                'danceability': 0.7,
                'loudness': -5.0,
                'valence': 0.6,
                'acousticness': 0.1,
                'instrumentalness': 0.0,
                'liveness': 0.2,
                'speechiness': 0.05,
                'duration_ms': 200000,
                'key': 5,
                'mode': 1,
                'time_signature': 4
            }
            response = client.post(
                '/api/predict',
                data=json.dumps(data),
                content_type='application/json'
            )
        
        elif error_type == 'empty_body':
            # Empty request body
            response = client.post(
                '/api/predict',
                data='',
                content_type='application/json'
            )
        
        # Check that the response indicates an error (4xx or 5xx status code)
        assert response.status_code >= 400, \
            f"Error response should have status code >= 400, got: {response.status_code}"
        
        # Parse the response
        data = json.loads(response.data)
        
        # Check that the response contains an error object
        assert 'error' in data, \
            "Error response must contain 'error' field"
        assert isinstance(data['error'], dict), \
            "Error field must be a dictionary"
        
        # Check that error object has required fields
        assert 'code' in data['error'], \
            "Error object must contain 'code' field"
        assert 'message' in data['error'], \
            "Error object must contain 'message' field"
        
        # Check that error code is a non-empty string
        assert isinstance(data['error']['code'], str), \
            "Error code must be a string"
        assert len(data['error']['code']) > 0, \
            "Error code must not be empty"
        
        # Check that error message is a non-empty string
        assert isinstance(data['error']['message'], str), \
            "Error message must be a string"
        assert len(data['error']['message']) > 0, \
            "Error message must not be empty"
        
        # Check that error message is user-friendly (no technical details)
        # Technical terms to avoid in user-facing messages
        technical_terms = [
            'traceback', 'exception', 'stack', 'null pointer',
            'segfault', 'core dump', '__', 'TypeError', 'ValueError',
            'AttributeError', 'KeyError', '.py', 'line ', 'File "'
        ]
        
        error_message_lower = data['error']['message'].lower()
        for term in technical_terms:
            assert term.lower() not in error_message_lower, \
                f"Error message should not contain technical term '{term}': {data['error']['message']}"
        
        # Check that the message is reasonably descriptive (at least 10 characters)
        assert len(data['error']['message']) >= 10, \
            f"Error message should be descriptive (at least 10 characters): {data['error']['message']}"
