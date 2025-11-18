"""
Unit tests for API endpoints
Tests /api/predict, /api/similar, and /api/eda-data endpoints
"""
import pytest
import json
from app import create_app


@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def valid_track_features():
    """Sample valid track features for testing"""
    return {
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


class TestPredictEndpoint:
    """Tests for /api/predict endpoint"""
    
    def test_predict_with_valid_input(self, client, valid_track_features):
        """Test /api/predict with valid track features"""
        response = client.post(
            '/api/predict',
            data=json.dumps(valid_track_features),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        # Check response structure
        assert 'prediction' in data
        assert 'confidence' in data
        assert 'probabilities' in data
        
        # Check prediction value
        assert data['prediction'] in ['hit', 'miss']
        
        # Check confidence is between 0 and 1
        assert 0.0 <= data['confidence'] <= 1.0
        
        # Check probabilities structure
        assert 'hit' in data['probabilities']
        assert 'miss' in data['probabilities']
        assert 0.0 <= data['probabilities']['hit'] <= 1.0
        assert 0.0 <= data['probabilities']['miss'] <= 1.0
    
    def test_predict_with_missing_feature(self, client, valid_track_features):
        """Test /api/predict with missing required feature"""
        incomplete_features = valid_track_features.copy()
        del incomplete_features['tempo']
        
        response = client.post(
            '/api/predict',
            data=json.dumps(incomplete_features),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'tempo' in data['error']['message'].lower()
    
    def test_predict_with_invalid_range(self, client, valid_track_features):
        """Test /api/predict with feature value outside acceptable range"""
        invalid_features = valid_track_features.copy()
        invalid_features['energy'] = 1.5  # Should be between 0 and 1
        
        response = client.post(
            '/api/predict',
            data=json.dumps(invalid_features),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'energy' in data['error']['message'].lower()
    
    def test_predict_with_non_numeric_value(self, client, valid_track_features):
        """Test /api/predict with non-numeric feature value"""
        invalid_features = valid_track_features.copy()
        invalid_features['tempo'] = 'not_a_number'
        
        response = client.post(
            '/api/predict',
            data=json.dumps(invalid_features),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_predict_with_empty_body(self, client):
        """Test /api/predict with empty request body"""
        response = client.post(
            '/api/predict',
            data='',
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data


class TestSimilarEndpoint:
    """Tests for /api/similar endpoint"""
    
    def test_similar_with_valid_input(self, client, valid_track_features):
        """Test /api/similar with valid track features"""
        response = client.post(
            '/api/similar',
            data=json.dumps(valid_track_features),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        # Check response structure
        assert 'similar_tracks' in data
        assert isinstance(data['similar_tracks'], list)
        
        # Check default returns 5 tracks
        assert len(data['similar_tracks']) == 5
        
        # Check each track has required fields
        for track in data['similar_tracks']:
            assert 'track_name' in track
            assert 'artist' in track
            assert 'similarity_score' in track
            assert 'features' in track
            assert 0.0 <= track['similarity_score'] <= 1.0
    
    def test_similar_with_custom_n_recommendations(self, client, valid_track_features):
        """Test /api/similar with custom number of recommendations"""
        request_data = valid_track_features.copy()
        request_data['n_recommendations'] = 7
        
        response = client.post(
            '/api/similar',
            data=json.dumps(request_data),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data['similar_tracks']) == 7
    
    def test_similar_with_nested_features(self, client, valid_track_features):
        """Test /api/similar with features nested under 'features' key"""
        request_data = {'features': valid_track_features, 'n_recommendations': 3}
        
        response = client.post(
            '/api/similar',
            data=json.dumps(request_data),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data['similar_tracks']) == 3
    
    def test_similar_enforces_min_recommendations(self, client, valid_track_features):
        """Test /api/similar enforces minimum of 3 recommendations"""
        request_data = valid_track_features.copy()
        request_data['n_recommendations'] = 1
        
        response = client.post(
            '/api/similar',
            data=json.dumps(request_data),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data['similar_tracks']) >= 3
    
    def test_similar_enforces_max_recommendations(self, client, valid_track_features):
        """Test /api/similar enforces maximum of 10 recommendations"""
        request_data = valid_track_features.copy()
        request_data['n_recommendations'] = 20
        
        response = client.post(
            '/api/similar',
            data=json.dumps(request_data),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data['similar_tracks']) <= 10
    
    def test_similar_with_invalid_features(self, client, valid_track_features):
        """Test /api/similar with invalid feature values"""
        invalid_features = valid_track_features.copy()
        invalid_features['danceability'] = 2.0  # Should be between 0 and 1
        
        response = client.post(
            '/api/similar',
            data=json.dumps(invalid_features),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data


class TestEDAEndpoint:
    """Tests for /api/eda-data endpoint"""
    
    def test_eda_data_returns_correct_structure(self, client):
        """Test /api/eda-data returns correct data structure"""
        response = client.get('/api/eda-data')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        # Check main keys exist
        assert 'feature_distributions' in data
        assert 'correlations' in data
        assert 'summary_statistics' in data
        assert 'hit_miss_distribution' in data
    
    def test_eda_feature_distributions(self, client):
        """Test /api/eda-data feature distributions structure"""
        response = client.get('/api/eda-data')
        data = json.loads(response.data)
        
        distributions = data['feature_distributions']
        
        # Check that distributions exist for key features
        expected_features = ['tempo', 'energy', 'danceability', 'loudness']
        for feature in expected_features:
            assert feature in distributions
            assert 'bins' in distributions[feature]
            assert 'counts' in distributions[feature]
            assert isinstance(distributions[feature]['bins'], list)
            assert isinstance(distributions[feature]['counts'], list)
    
    def test_eda_correlations(self, client):
        """Test /api/eda-data correlations structure"""
        response = client.get('/api/eda-data')
        data = json.loads(response.data)
        
        correlations = data['correlations']
        
        assert 'features' in correlations
        assert 'matrix' in correlations
        assert isinstance(correlations['features'], list)
        assert isinstance(correlations['matrix'], list)
        
        # Check matrix is square
        n_features = len(correlations['features'])
        assert len(correlations['matrix']) == n_features
        for row in correlations['matrix']:
            assert len(row) == n_features
    
    def test_eda_summary_statistics(self, client):
        """Test /api/eda-data summary statistics structure"""
        response = client.get('/api/eda-data')
        data = json.loads(response.data)
        
        stats = data['summary_statistics']
        
        # Check statistics for at least one feature
        assert len(stats) > 0
        
        # Check structure of statistics
        for feature, feature_stats in stats.items():
            assert 'mean' in feature_stats
            assert 'std' in feature_stats
            assert 'min' in feature_stats
            assert 'max' in feature_stats
            assert 'q25' in feature_stats
            assert 'q50' in feature_stats
            assert 'q75' in feature_stats
    
    def test_eda_hit_miss_distribution(self, client):
        """Test /api/eda-data hit/miss distribution structure"""
        response = client.get('/api/eda-data')
        data = json.loads(response.data)
        
        hit_miss = data['hit_miss_distribution']
        
        assert 'hit' in hit_miss
        assert 'miss' in hit_miss
        assert isinstance(hit_miss['hit'], int)
        assert isinstance(hit_miss['miss'], int)


class TestErrorHandling:
    """Tests for error handling across all endpoints"""
    
    def test_predict_error_format(self, client):
        """Test that prediction errors follow consistent format"""
        response = client.post(
            '/api/predict',
            data=json.dumps({}),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        
        # Check error structure
        assert 'error' in data
        assert 'code' in data['error']
        assert 'message' in data['error']
    
    def test_similar_error_format(self, client):
        """Test that similar tracks errors follow consistent format"""
        response = client.post(
            '/api/similar',
            data=json.dumps({}),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        
        # Check error structure
        assert 'error' in data
        assert 'code' in data['error']
        assert 'message' in data['error']
