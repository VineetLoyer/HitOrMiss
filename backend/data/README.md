# Dataset Directory

## Kaggle Spotify Tracks Dataset

This directory should contain the Spotify Tracks Dataset from Kaggle.

### Download Instructions

1. Visit the Kaggle dataset page:
   - **Option 1**: [Spotify Tracks Dataset](https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset)
   - **Option 2**: [Spotify Dataset 1921-2020](https://www.kaggle.com/datasets/yamaerenay/spotify-dataset-19212020)
   - **Option 3**: Any similar Spotify tracks dataset with audio features

2. Download the CSV file

3. Rename it to `dataset.csv` and place it in this directory

### Required Columns

The dataset must contain the following columns:

**Target Variable:**
- `popularity` - Used to define hit/miss (numeric, 0-100)

**Feature Columns:**
- `tempo` - BPM (beats per minute)
- `energy` - Energy level (0.0-1.0)
- `danceability` - Danceability score (0.0-1.0)
- `loudness` - Loudness in dB
- `valence` - Musical positiveness (0.0-1.0)
- `acousticness` - Acoustic quality (0.0-1.0)
- `instrumentalness` - Instrumental content (0.0-1.0)
- `liveness` - Live performance likelihood (0.0-1.0)
- `speechiness` - Spoken word content (0.0-1.0)
- `duration_ms` - Track duration in milliseconds
- `key` - Musical key (0-11)
- `mode` - Major (1) or minor (0)
- `time_signature` - Time signature (3-7)

**Optional Columns (for recommendations):**
- `track_name` - Name of the track
- `artists` or `artist` - Artist name(s)
- `track_id` - Spotify track ID

### Alternative: Sample Dataset

If you don't have access to Kaggle, you can create a sample dataset for testing:

```python
import pandas as pd
import numpy as np

# Create sample data
np.random.seed(42)
n_samples = 1000

data = {
    'track_name': [f'Track_{i}' for i in range(n_samples)],
    'artists': [f'Artist_{i % 100}' for i in range(n_samples)],
    'popularity': np.random.randint(0, 100, n_samples),
    'tempo': np.random.uniform(60, 200, n_samples),
    'energy': np.random.uniform(0, 1, n_samples),
    'danceability': np.random.uniform(0, 1, n_samples),
    'loudness': np.random.uniform(-60, 0, n_samples),
    'valence': np.random.uniform(0, 1, n_samples),
    'acousticness': np.random.uniform(0, 1, n_samples),
    'instrumentalness': np.random.uniform(0, 1, n_samples),
    'liveness': np.random.uniform(0, 1, n_samples),
    'speechiness': np.random.uniform(0, 1, n_samples),
    'duration_ms': np.random.randint(60000, 300000, n_samples),
    'key': np.random.randint(0, 12, n_samples),
    'mode': np.random.randint(0, 2, n_samples),
    'time_signature': np.random.randint(3, 8, n_samples)
}

df = pd.DataFrame(data)
df.to_csv('backend/data/dataset.csv', index=False)
print("Sample dataset created!")
```

### File Structure

After downloading, your directory should look like:
```
backend/data/
├── .gitkeep
├── README.md (this file)
└── dataset.csv (your downloaded dataset)
```
