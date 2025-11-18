"""
ML Service Module
Handles model loading and prediction logic
"""
import joblib
import numpy as np
import os

class ModelService:
    def __init__(self, model_path: str, scaler_path: str = None, genre_encoder_path: str = None):
        """
        Initialize the model service
        
        Args:
            model_path: Path to the trained model file
            scaler_path: Path to the scaler file (optional)
            genre_encoder_path: Path to the genre encoder file (optional)
        """
        self.model_path = model_path
        self.scaler_path = scaler_path or model_path.replace('model.pkl', 'scaler.pkl')
        self.genre_encoder_path = genre_encoder_path
        
        self.model = self._load_model()
        self.scaler = self._load_scaler()
        self.genre_encoder = self._load_genre_encoder() if genre_encoder_path else None
        
        # Base feature columns (must match training order)
        self.base_features = [
            'tempo', 'energy', 'danceability', 'loudness', 'valence',
            'acousticness', 'instrumentalness', 'liveness', 'speechiness',
            'duration_ms', 'key', 'mode', 'time_signature'
        ]
    
    def _load_model(self):
        """Load the trained model from disk"""
        try:
            model = joblib.load(self.model_path)
            return model
        except Exception as e:
            raise RuntimeError(f"Failed to load model from {self.model_path}: {str(e)}")
    
    def _load_scaler(self):
        """Load the feature scaler from disk"""
        try:
            scaler = joblib.load(self.scaler_path)
            return scaler
        except Exception as e:
            raise RuntimeError(f"Failed to load scaler from {self.scaler_path}: {str(e)}")
    
    def _load_genre_encoder(self):
        """Load the genre encoder from disk if it exists"""
        if self.genre_encoder_path and os.path.exists(self.genre_encoder_path):
            try:
                encoder = joblib.load(self.genre_encoder_path)
                return encoder
            except Exception as e:
                print(f"Warning: Failed to load genre encoder: {str(e)}")
                return None
        return None
    
    def predict(self, features: dict) -> dict:
        """
        Generate prediction and confidence scores
        
        Args:
            features: Dictionary of track features
            
        Returns:
            Dictionary with prediction ('hit' or 'miss'), confidence, and probabilities
        """
        # Preprocess features
        X = self.preprocess_features(features)
        
        # Get prediction
        prediction = self.model.predict(X)[0]
        
        # Get probabilities
        probabilities = self.predict_proba(features)
        
        # Convert prediction to hit/miss
        prediction_label = 'hit' if prediction == 1 else 'miss'
        
        # Confidence is the probability of the predicted class
        confidence = float(probabilities[prediction])
        
        return {
            'prediction': prediction_label,
            'confidence': confidence,
            'probabilities': {
                'miss': float(probabilities[0]),
                'hit': float(probabilities[1])
            }
        }
    
    def predict_proba(self, features: dict) -> np.ndarray:
        """
        Get probability distribution
        
        Args:
            features: Dictionary of track features
            
        Returns:
            Probability array [prob_miss, prob_hit]
        """
        X = self.preprocess_features(features)
        probabilities = self.model.predict_proba(X)[0]
        return probabilities
    
    def preprocess_features(self, features: dict) -> np.ndarray:
        """
        Scale and transform input features
        
        Args:
            features: Dictionary of track features
            
        Returns:
            Preprocessed feature array ready for model input
        """
        # Extract base features in correct order
        feature_values = [features.get(col, 0) for col in self.base_features]
        
        # Add genre features if encoder exists (use default values if not provided)
        if self.genre_encoder is not None:
            # Use neutral/default genre values
            # genre_encoded: use middle value
            genre_encoded = len(self.genre_encoder.classes_) // 2
            # genre statistics: use neutral values (50 for popularity metrics)
            genre_pop_mean = 50.0
            genre_pop_std = 15.0
            genre_pop_median = 50.0
            
            feature_values.extend([genre_encoded, genre_pop_mean, genre_pop_std, genre_pop_median])
        
        # Engineer additional features (must match training)
        energy = features.get('energy', 0)
        danceability = features.get('danceability', 0)
        loudness = features.get('loudness', 0)
        valence = features.get('valence', 0)
        acousticness = features.get('acousticness', 0)
        instrumentalness = features.get('instrumentalness', 0)
        liveness = features.get('liveness', 0)
        speechiness = features.get('speechiness', 0)
        duration_ms = features.get('duration_ms', 0)
        
        # Interaction features
        energy_loudness = energy * loudness
        dance_energy = danceability * energy
        valence_energy = valence * energy
        acoustic_instrumental = acousticness * instrumentalness
        
        # Polynomial features
        energy_squared = energy ** 2
        danceability_squared = danceability ** 2
        loudness_squared = loudness ** 2
        
        # Duration in minutes
        duration_min = duration_ms / 60000
        
        # Ratio features
        speech_to_music = speechiness / (instrumentalness + 0.01)
        live_to_studio = liveness / (1 - liveness + 0.01)
        
        # Add engineered features
        feature_values.extend([
            energy_loudness, dance_energy, valence_energy, acoustic_instrumental,
            energy_squared, danceability_squared, loudness_squared,
            duration_min, speech_to_music, live_to_studio
        ])
        
        # Convert to numpy array and reshape
        X = np.array(feature_values).reshape(1, -1)
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        return X_scaled
