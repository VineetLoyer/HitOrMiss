"""
Model Training Module
Trains the classification model on Spotify dataset
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
import joblib
import os

# Feature columns to use for training
FEATURE_COLUMNS = [
    'tempo', 'energy', 'danceability', 'loudness', 'valence',
    'acousticness', 'instrumentalness', 'liveness', 'speechiness',
    'duration_ms', 'key', 'mode', 'time_signature'
]

def load_and_prepare_data(filepath: str, add_features=True, use_genre=True):
    """
    Load dataset and split into features and target
    
    Args:
        filepath: Path to the dataset CSV
        add_features: Whether to add engineered features
        use_genre: Whether to include genre features
        
    Returns:
        Tuple of (DataFrame, features, target, genre_encoder)
    """
    print(f"Loading dataset from {filepath}...")
    df = pd.read_csv(filepath)
    
    print(f"Dataset loaded with {len(df)} rows and {len(df.columns)} columns")
    
    # Create target variable
    y = create_target_variable(df)
    
    # Select feature columns
    # Check which features are available in the dataset
    available_features = [col for col in FEATURE_COLUMNS if col in df.columns]
    
    if len(available_features) < len(FEATURE_COLUMNS):
        missing = set(FEATURE_COLUMNS) - set(available_features)
        print(f"Warning: Missing features in dataset: {missing}")
    
    X = df[available_features].copy()
    
    # Handle missing values
    if X.isnull().any().any():
        print("Handling missing values...")
        X = X.fillna(X.median())
    
    # Add genre encoding if available
    genre_encoder = None
    if use_genre and 'track_genre' in df.columns:
        print("\nEncoding genre information...")
        from sklearn.preprocessing import LabelEncoder
        genre_encoder = LabelEncoder()
        X['genre_encoded'] = genre_encoder.fit_transform(df['track_genre'])
        
        # Calculate genre popularity statistics
        genre_stats = df.groupby('track_genre')['popularity'].agg(['mean', 'std', 'median']).reset_index()
        genre_stats.columns = ['track_genre', 'genre_pop_mean', 'genre_pop_std', 'genre_pop_median']
        
        # Merge back to dataframe
        df_with_stats = df.merge(genre_stats, on='track_genre', how='left')
        X['genre_pop_mean'] = df_with_stats['genre_pop_mean']
        X['genre_pop_std'] = df_with_stats['genre_pop_std'].fillna(0)
        X['genre_pop_median'] = df_with_stats['genre_pop_median']
        
        print(f"Added genre features (114 unique genres)")
    
    # Add engineered features
    if add_features:
        print("\nEngineering additional features...")
        
        # Interaction features
        X['energy_loudness'] = X['energy'] * X['loudness']
        X['dance_energy'] = X['danceability'] * X['energy']
        X['valence_energy'] = X['valence'] * X['energy']
        X['acoustic_instrumental'] = X['acousticness'] * X['instrumentalness']
        
        # Polynomial features for key continuous variables
        X['energy_squared'] = X['energy'] ** 2
        X['danceability_squared'] = X['danceability'] ** 2
        X['loudness_squared'] = X['loudness'] ** 2
        
        # Duration in minutes (more interpretable)
        X['duration_min'] = X['duration_ms'] / 60000
        
        # Ratio features
        X['speech_to_music'] = X['speechiness'] / (X['instrumentalness'] + 0.01)
        X['live_to_studio'] = X['liveness'] / (1 - X['liveness'] + 0.01)
        
        print(f"Added {X.shape[1] - len(available_features) - (4 if use_genre else 0)} engineered features")
    
    print(f"Total features: {X.shape[1]}")
    print(f"Target distribution:\n{y.value_counts()}")
    
    return df, X, y, genre_encoder

def create_target_variable(df: pd.DataFrame) -> pd.Series:
    """
    Define hit/miss based on popularity threshold
    
    Args:
        df: DataFrame with track data
        
    Returns:
        Series with binary target variable (1 = hit, 0 = miss)
    """
    # Use popularity column if available
    if 'popularity' in df.columns:
        # Define hit as top 30% of tracks by popularity
        threshold = df['popularity'].quantile(0.70)
        target = (df['popularity'] >= threshold).astype(int)
        print(f"Using popularity threshold: {threshold:.2f}")
        print(f"Hits: {target.sum()}, Misses: {len(target) - target.sum()}")
    else:
        raise ValueError("Dataset must contain 'popularity' column")
    
    return target

def train_model(X_train, y_train, model_type='xgboost'):
    """
    Train classification model with optimized hyperparameters
    
    Args:
        X_train: Training features
        y_train: Training target
        model_type: Type of model ('random_forest', 'xgboost', 'ensemble')
        
    Returns:
        Trained model
    """
    print(f"\nTraining {model_type} model...")
    
    if model_type == 'random_forest':
        model = RandomForestClassifier(
            n_estimators=300,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            max_features='sqrt',
            class_weight='balanced',
            random_state=42,
            n_jobs=-1
        )
    elif model_type == 'gradient_boosting':
        model = GradientBoostingClassifier(
            n_estimators=200,
            max_depth=7,
            learning_rate=0.05,
            subsample=0.8,
            random_state=42
        )
    elif model_type == 'xgboost':
        # Calculate scale_pos_weight for class imbalance
        scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
        
        model = XGBClassifier(
            n_estimators=500,
            max_depth=10,
            learning_rate=0.03,
            subsample=0.9,
            colsample_bytree=0.9,
            gamma=0.1,
            min_child_weight=1,
            reg_alpha=0.1,
            reg_lambda=1.0,
            scale_pos_weight=scale_pos_weight,
            random_state=42,
            n_jobs=-1,
            eval_metric='logloss'
        )
    elif model_type == 'ensemble':
        # Ensemble of multiple models
        rf = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1
        )
        
        scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
        xgb = XGBClassifier(
            n_estimators=200,
            max_depth=8,
            learning_rate=0.05,
            scale_pos_weight=scale_pos_weight,
            random_state=42,
            n_jobs=-1,
            eval_metric='logloss'
        )
        
        gb = GradientBoostingClassifier(
            n_estimators=150,
            max_depth=7,
            learning_rate=0.05,
            random_state=42
        )
        
        model = VotingClassifier(
            estimators=[('rf', rf), ('xgb', xgb), ('gb', gb)],
            voting='soft',
            n_jobs=-1
        )
    else:
        raise ValueError(f"Unknown model type: {model_type}")
    
    model.fit(X_train, y_train)
    print("Model training complete!")
    
    return model

def evaluate_model(model, X_test, y_test) -> dict:
    """
    Calculate accuracy, precision, recall, F1
    
    Args:
        model: Trained model
        X_test: Test features
        y_test: Test target
        
    Returns:
        Dictionary with evaluation metrics
    """
    print("\nEvaluating model...")
    
    y_pred = model.predict(X_test)
    
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred, zero_division=0),
        'recall': recall_score(y_test, y_pred, zero_division=0),
        'f1': f1_score(y_test, y_pred, zero_division=0)
    }
    
    print("\nModel Performance:")
    print(f"Accuracy:  {metrics['accuracy']:.4f}")
    print(f"Precision: {metrics['precision']:.4f}")
    print(f"Recall:    {metrics['recall']:.4f}")
    print(f"F1 Score:  {metrics['f1']:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Miss', 'Hit']))
    
    return metrics

def save_model(model, scaler, path: str, genre_encoder=None):
    """
    Serialize model, scaler, and genre encoder
    
    Args:
        model: Trained model
        scaler: Fitted scaler
        path: Directory path to save files
        genre_encoder: Genre label encoder (optional)
    """
    os.makedirs(path, exist_ok=True)
    
    model_path = os.path.join(path, 'model.pkl')
    scaler_path = os.path.join(path, 'scaler.pkl')
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    
    print(f"\nModel saved to: {model_path}")
    print(f"Scaler saved to: {scaler_path}")
    
    if genre_encoder is not None:
        genre_path = os.path.join(path, 'genre_encoder.pkl')
        joblib.dump(genre_encoder, genre_path)
        print(f"Genre encoder saved to: {genre_path}")

if __name__ == '__main__':
    # Configuration
    DATASET_PATH = '../Dataset/dataset.csv'  # Dataset is in root Dataset directory
    MODEL_OUTPUT_PATH = 'models'
    TEST_SIZE = 0.2
    RANDOM_STATE = 42
    
    print("=" * 60)
    print("Spotify Track Predictor - Model Training")
    print("=" * 60)
    
    # Check if dataset exists
    if not os.path.exists(DATASET_PATH):
        print(f"\nError: Dataset not found at {DATASET_PATH}")
        print("\nPlease download the Kaggle Spotify Tracks Dataset and place it at:")
        print(f"  {DATASET_PATH}")
        print("\nDataset should contain the following columns:")
        print("  - popularity (target variable)")
        print("  - " + "\n  - ".join(FEATURE_COLUMNS))
        exit(1)
    
    try:
        # Load and prepare data
        df, X, y, genre_encoder = load_and_prepare_data(DATASET_PATH, add_features=True, use_genre=True)
        
        # Split data
        print(f"\nSplitting data (test size: {TEST_SIZE})...")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
        )
        print(f"Training set: {len(X_train)} samples")
        print(f"Test set: {len(X_test)} samples")
        
        # Scale features
        print("\nScaling features...")
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train XGBoost model with genre features
        print("\n" + "=" * 60)
        print("TRAINING XGBOOST MODEL WITH GENRE FEATURES")
        print("=" * 60)
        model = train_model(X_train_scaled, y_train, model_type='xgboost')
        
        # Evaluate model
        metrics = evaluate_model(model, X_test_scaled, y_test)
        
        # Save model, scaler, and genre encoder
        save_model(model, scaler, MODEL_OUTPUT_PATH, genre_encoder)
        
        print("\n" + "=" * 60)
        print("Training complete!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\nError during training: {str(e)}")
        import traceback
        traceback.print_exc()
        exit(1)
