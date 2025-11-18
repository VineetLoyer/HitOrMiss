"""
Explore dataset to understand feature importance and correlations
"""
import pandas as pd
import numpy as np

# Load dataset
df = pd.read_csv('../Dataset/dataset.csv')

print("Dataset Shape:", df.shape)
print("\nColumns:", list(df.columns))

# Check popularity distribution
print("\n" + "="*60)
print("POPULARITY ANALYSIS")
print("="*60)
print(df['popularity'].describe())
print(f"\nPopularity percentiles:")
for p in [50, 60, 70, 80, 90, 95]:
    print(f"  {p}th percentile: {df['popularity'].quantile(p/100):.2f}")

# Feature correlations with popularity
print("\n" + "="*60)
print("FEATURE CORRELATIONS WITH POPULARITY")
print("="*60)

features = ['tempo', 'energy', 'danceability', 'loudness', 'valence',
            'acousticness', 'instrumentalness', 'liveness', 'speechiness',
            'duration_ms', 'key', 'mode', 'time_signature']

correlations = []
for feat in features:
    if feat in df.columns:
        corr = df[feat].corr(df['popularity'])
        correlations.append((feat, corr))

correlations.sort(key=lambda x: abs(x[1]), reverse=True)
for feat, corr in correlations:
    print(f"  {feat:20s}: {corr:+.4f}")

# Check for missing values
print("\n" + "="*60)
print("MISSING VALUES")
print("="*60)
missing = df[features].isnull().sum()
if missing.sum() > 0:
    print(missing[missing > 0])
else:
    print("No missing values in feature columns")

# Check data types
print("\n" + "="*60)
print("DATA TYPES")
print("="*60)
print(df[features].dtypes)
