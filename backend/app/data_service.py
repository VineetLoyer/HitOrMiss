"""
Data Service Module
Handles dataset loading and similarity calculations
"""
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler

class DataService:
    def __init__(self, dataset_path: str):
        """
        Initialize the data service
        
        Args:
            dataset_path: Path to the Spotify dataset CSV
        """
        self.dataset_path = dataset_path
        self.df = self._load_dataset()
        self.feature_columns = [
            'tempo', 'energy', 'danceability', 'loudness', 'valence',
            'acousticness', 'instrumentalness', 'liveness', 'speechiness',
            'duration_ms', 'key', 'mode', 'time_signature'
        ]
        # Scale features for similarity calculations
        self.scaler = StandardScaler()
        self.scaled_features = self.scaler.fit_transform(self.df[self.feature_columns])
    
    def _load_dataset(self) -> pd.DataFrame:
        """
        Load the dataset from CSV
        
        Returns:
            DataFrame with track data
        """
        try:
            df = pd.read_csv(self.dataset_path)
            # Handle missing values
            df = df.fillna(df.median(numeric_only=True))
            return df
        except Exception as e:
            raise RuntimeError(f"Failed to load dataset from {self.dataset_path}: {str(e)}")
    
    def find_similar_tracks(self, features: dict, n: int = 5) -> list:
        """
        Find n most similar tracks using cosine similarity
        
        Args:
            features: Dictionary of track features
            n: Number of similar tracks to return (between 3 and 10)
            
        Returns:
            List of similar tracks with metadata
        """
        # Ensure n is between 3 and 10
        n = max(3, min(10, n))
        
        # Extract feature values in the correct order
        input_features = np.array([[features.get(col, 0) for col in self.feature_columns]])
        
        # Scale the input features
        input_scaled = self.scaler.transform(input_features)
        
        # Calculate cosine similarity with all tracks
        similarities = cosine_similarity(input_scaled, self.scaled_features)[0]
        
        # Get indices of top n most similar tracks
        top_indices = np.argsort(similarities)[-n:][::-1]
        
        # Build result list
        similar_tracks = []
        for idx in top_indices:
            track = {
                'track_name': self.df.iloc[idx].get('track_name', 'Unknown'),
                'artist': self.df.iloc[idx].get('artists', 'Unknown'),
                'similarity_score': float(similarities[idx]),
                'features': {col: float(self.df.iloc[idx][col]) for col in self.feature_columns}
            }
            similar_tracks.append(track)
        
        return similar_tracks
    
    def get_eda_data(self) -> dict:
        """
        Generate EDA statistics and distributions
        
        Returns:
            Dictionary with EDA data including distributions, correlations, and statistics
        """
        # Calculate feature distributions (histograms)
        feature_distributions = {}
        for col in self.feature_columns:
            hist, bin_edges = np.histogram(self.df[col].dropna(), bins=20)
            feature_distributions[col] = {
                'bins': bin_edges.tolist(),
                'counts': hist.tolist()
            }
        
        # Calculate correlation matrix
        corr_matrix = self.df[self.feature_columns].corr()
        correlations = {
            'features': self.feature_columns,
            'matrix': corr_matrix.values.tolist()
        }
        
        # Calculate summary statistics
        summary_statistics = self.get_feature_statistics()
        
        # Calculate hit/miss distribution if popularity exists
        hit_miss_distribution = {'hit': 0, 'miss': 0}
        if 'popularity' in self.df.columns:
            threshold = self.df['popularity'].quantile(0.70)
            hits = (self.df['popularity'] >= threshold).sum()
            misses = len(self.df) - hits
            hit_miss_distribution = {
                'hit': int(hits),
                'miss': int(misses)
            }
        
        return {
            'feature_distributions': feature_distributions,
            'correlations': correlations,
            'summary_statistics': summary_statistics,
            'hit_miss_distribution': hit_miss_distribution
        }
    
    def get_feature_statistics(self) -> dict:
        """
        Calculate summary statistics for features
        
        Returns:
            Dictionary with feature statistics (mean, std, min, max, quartiles)
        """
        statistics = {}
        for col in self.feature_columns:
            col_data = self.df[col].dropna()
            statistics[col] = {
                'mean': float(col_data.mean()),
                'std': float(col_data.std()),
                'min': float(col_data.min()),
                'max': float(col_data.max()),
                'q25': float(col_data.quantile(0.25)),
                'q50': float(col_data.quantile(0.50)),
                'q75': float(col_data.quantile(0.75))
            }
        
        return statistics
