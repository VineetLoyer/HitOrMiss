"""
Test the trained model with all required features
"""
import joblib
import numpy as np
import pandas as pd

# Load model, scaler, and genre encoder
model = joblib.load('models/model.pkl')
scaler = joblib.load('models/scaler.pkl')
genre_encoder = joblib.load('models/genre_encoder.pkl')

print('Model loaded successfully!')
print(f'Model type: {type(model).__name__}')
print(f'Number of features expected: {model.n_features_in_}')

# Test with sample features
# Base features: tempo, energy, danceability, loudness, valence, acousticness, 
#                instrumentalness, liveness, speechiness, duration_ms, key, mode, time_signature
base_features = {
    'tempo': 120,
    'energy': 0.8,
    'danceability': 0.7,
    'loudness': -5,
    'valence': 0.6,
    'acousticness': 0.2,
    'instrumentalness': 0.1,
    'liveness': 0.15,
    'speechiness': 0.05,
    'duration_ms': 200000,
    'key': 5,
    'mode': 1,
    'time_signature': 4
}

# Add genre features (using 'pop' genre as example)
genre = 'pop'
genre_encoded = genre_encoder.transform([genre])[0]
base_features['genre_encoded'] = genre_encoded
base_features['genre_pop_mean'] = 45.0  # Example value
base_features['genre_pop_std'] = 20.0   # Example value
base_features['genre_pop_median'] = 43.0  # Example value

# Add engineered features
base_features['energy_loudness'] = base_features['energy'] * base_features['loudness']
base_features['dance_energy'] = base_features['danceability'] * base_features['energy']
base_features['valence_energy'] = base_features['valence'] * base_features['energy']
base_features['acoustic_instrumental'] = base_features['acousticness'] * base_features['instrumentalness']
base_features['energy_squared'] = base_features['energy'] ** 2
base_features['danceability_squared'] = base_features['danceability'] ** 2
base_features['loudness_squared'] = base_features['loudness'] ** 2
base_features['duration_min'] = base_features['duration_ms'] / 60000
base_features['speech_to_music'] = base_features['speechiness'] / (base_features['instrumentalness'] + 0.01)
base_features['live_to_studio'] = base_features['liveness'] / (1 - base_features['liveness'] + 0.01)

# Convert to DataFrame to maintain feature order
feature_df = pd.DataFrame([base_features])

# Scale features
test_scaled = scaler.transform(feature_df)

# Make prediction
pred = model.predict(test_scaled)
proba = model.predict_proba(test_scaled)

print(f'\nTest prediction: {"Hit" if pred[0] == 1 else "Miss"}')
print(f'Probabilities: Miss={proba[0][0]:.3f}, Hit={proba[0][1]:.3f}')
print('\nModel is ready for use!')
