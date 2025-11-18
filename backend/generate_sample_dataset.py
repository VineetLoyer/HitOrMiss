"""
Generate Sample Spotify Dataset
Creates a synthetic dataset for testing when real Kaggle data is not available
"""
import pandas as pd
import numpy as np
import os

def generate_sample_dataset(n_samples=5000, output_path='data/dataset.csv'):
    """
    Generate a sample Spotify-like dataset with realistic distributions
    
    Args:
        n_samples: Number of tracks to generate
        output_path: Path to save the CSV file
    """
    print(f"Generating sample dataset with {n_samples} tracks...")
    
    np.random.seed(42)
    
    # Generate track metadata
    track_names = [f'Track_{i:04d}' for i in range(n_samples)]
    artists = [f'Artist_{i % 500:03d}' for i in range(n_samples)]
    
    # Generate popularity with realistic distribution (skewed towards lower values)
    popularity = np.random.beta(2, 5, n_samples) * 100
    
    # Generate audio features with realistic ranges and correlations
    
    # Tempo: typically 60-200 BPM, normal distribution around 120
    tempo = np.clip(np.random.normal(120, 30, n_samples), 40, 220)
    
    # Energy: 0-1, slightly skewed towards higher values
    energy = np.random.beta(5, 3, n_samples)
    
    # Danceability: 0-1, normal-ish distribution
    danceability = np.clip(np.random.beta(5, 5, n_samples), 0, 1)
    
    # Loudness: typically -60 to 0 dB, concentrated around -5 to -10
    loudness = np.clip(np.random.normal(-7, 5, n_samples), -60, 0)
    
    # Valence: 0-1, uniform-ish distribution
    valence = np.random.beta(4, 4, n_samples)
    
    # Acousticness: 0-1, skewed towards lower values (most tracks are not acoustic)
    acousticness = np.random.beta(2, 8, n_samples)
    
    # Instrumentalness: 0-1, heavily skewed towards 0 (most tracks have vocals)
    instrumentalness = np.random.beta(1, 20, n_samples)
    
    # Liveness: 0-1, heavily skewed towards lower values (most tracks are studio)
    liveness = np.random.beta(2, 10, n_samples)
    
    # Speechiness: 0-1, heavily skewed towards lower values
    speechiness = np.random.beta(2, 15, n_samples)
    
    # Duration: typically 2-5 minutes (120,000-300,000 ms)
    duration_ms = np.random.normal(210000, 60000, n_samples).astype(int)
    duration_ms = np.clip(duration_ms, 60000, 600000)
    
    # Key: 0-11 (C, C#, D, ..., B)
    key = np.random.randint(0, 12, n_samples)
    
    # Mode: 0 (minor) or 1 (major), slightly more major
    mode = np.random.choice([0, 1], n_samples, p=[0.4, 0.6])
    
    # Time signature: mostly 4/4, some 3/4
    time_signature = np.random.choice([3, 4, 5], n_samples, p=[0.05, 0.90, 0.05])
    
    # Create DataFrame
    data = {
        'track_id': [f'spotify:track:{i:016x}' for i in range(n_samples)],
        'track_name': track_names,
        'artists': artists,
        'popularity': popularity.astype(int),
        'tempo': tempo,
        'energy': energy,
        'danceability': danceability,
        'loudness': loudness,
        'valence': valence,
        'acousticness': acousticness,
        'instrumentalness': instrumentalness,
        'liveness': liveness,
        'speechiness': speechiness,
        'duration_ms': duration_ms,
        'key': key,
        'mode': mode,
        'time_signature': time_signature
    }
    
    df = pd.DataFrame(data)
    
    # Add some correlations to make it more realistic
    # Higher energy tends to correlate with higher loudness
    df.loc[df['energy'] > 0.7, 'loudness'] += np.random.uniform(2, 5, (df['energy'] > 0.7).sum())
    df['loudness'] = np.clip(df['loudness'], -60, 0)
    
    # Higher danceability tends to correlate with higher valence
    df.loc[df['danceability'] > 0.7, 'valence'] += np.random.uniform(0.1, 0.2, (df['danceability'] > 0.7).sum())
    df['valence'] = np.clip(df['valence'], 0, 1)
    
    # Save to CSV
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    
    print(f"\nDataset saved to: {output_path}")
    print(f"Shape: {df.shape}")
    print(f"\nSample statistics:")
    print(df[['popularity', 'tempo', 'energy', 'danceability']].describe())
    print(f"\nPopularity distribution:")
    print(f"  Mean: {df['popularity'].mean():.2f}")
    print(f"  Median: {df['popularity'].median():.2f}")
    print(f"  70th percentile: {df['popularity'].quantile(0.70):.2f}")
    
    return df

if __name__ == '__main__':
    print("=" * 60)
    print("Sample Dataset Generator")
    print("=" * 60)
    
    # Generate dataset
    df = generate_sample_dataset(n_samples=5000, output_path='data/dataset.csv')
    
    print("\n" + "=" * 60)
    print("Sample dataset generated successfully!")
    print("You can now run: python train_model.py")
    print("=" * 60)
