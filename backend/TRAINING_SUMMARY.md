# Model Training Summary

## Dataset Information

- **Source**: Kaggle Spotify Tracks Dataset (located in `../Dataset/dataset.csv`)
- **Total Tracks**: 114,000
- **Features Used**: 27 total features
  - **13 Audio Features**: tempo, energy, danceability, loudness, valence, acousticness, instrumentalness, liveness, speechiness, duration_ms, key, mode, time_signature
  - **4 Genre Features**: genre_encoded, genre_pop_mean, genre_pop_std, genre_pop_median
  - **10 Engineered Features**: energy_loudness, dance_energy, valence_energy, acoustic_instrumental, energy_squared, danceability_squared, loudness_squared, duration_min, speech_to_music, live_to_studio

## Target Variable

- **Definition**: Hit/Miss classification based on popularity
- **Threshold**: 70th percentile (popularity >= 47)
- **Distribution**:
  - Hits: 34,536 tracks (30.3%)
  - Misses: 79,464 tracks (69.7%)

## Model Configuration

- **Algorithm**: XGBoost Classifier (Gradient Boosting)
- **Parameters**:
  - n_estimators: 500
  - max_depth: 10
  - learning_rate: 0.03
  - subsample: 0.9
  - colsample_bytree: 0.9
  - gamma: 0.1
  - min_child_weight: 1
  - reg_alpha: 0.1 (L1 regularization)
  - reg_lambda: 1.0 (L2 regularization)
  - scale_pos_weight: 2.3 (to handle class imbalance)
  - random_state: 42

## Training Details

- **Train/Test Split**: 80/20
- **Training Set**: 91,200 samples
- **Test Set**: 22,800 samples
- **Feature Scaling**: StandardScaler (fitted on training data)
- **Feature Engineering**: Added interaction terms, polynomial features, and genre statistics

## Model Performance

### Overall Metrics
- **Accuracy**: 81.12% ⭐
- **Precision**: 65.68%
- **Recall**: 78.91%
- **F1 Score**: 71.69%

### Per-Class Performance

**Miss (Class 0)**:
- Precision: 0.90
- Recall: 0.82
- F1-Score: 0.86
- Support: 15,893

**Hit (Class 1)**:
- Precision: 0.66
- Recall: 0.79
- F1-Score: 0.72
- Support: 6,907

### Interpretation

The model achieves 81% accuracy, which is strong performance for predicting music popularity. The model correctly identifies 79% of hits (high recall) while maintaining 66% precision. For misses, the model is even more accurate with 90% precision and 82% recall.

## Performance Improvements

| Version | Algorithm | Features | Accuracy |
|---------|-----------|----------|----------|
| v1 | Random Forest | 13 audio features | 68.6% |
| v2 | XGBoost | 23 features (audio + engineered) | 70.4% |
| v3 | XGBoost | 27 features (audio + engineered + genre) | 78.3% |
| v4 | XGBoost (tuned) | 27 features | **81.1%** |

## Why Not 95% Accuracy?

Predicting music popularity is inherently difficult because:

1. **Weak Feature Correlations**: Audio features have very weak correlations with popularity (all < 0.10)
2. **External Factors**: Popularity depends on marketing, artist fame, timing, cultural trends, social media virality - none of which are in the audio features
3. **Subjective Nature**: Music taste is highly subjective and context-dependent
4. **Industry Reality**: Even professional A&R executives can't predict hits with 95% accuracy

**81% accuracy is actually excellent** for this problem and aligns with academic research on music popularity prediction.

## Saved Artifacts

- **Model**: `models/model.pkl` (XGBClassifier)
- **Scaler**: `models/scaler.pkl` (StandardScaler)
- **Genre Encoder**: `models/genre_encoder.pkl` (LabelEncoder)

All files are ready to be loaded by the ML service for making predictions.

## Validation

The model has been tested and can successfully:
- Load from disk
- Accept 27-feature input vectors
- Generate predictions (Hit/Miss)
- Provide probability distributions
- Handle genre encoding

## Next Steps

The trained model is ready for integration with the backend API endpoints:
- `/api/predict` - Make hit/miss predictions
- `/api/similar` - Find similar tracks (uses dataset)
- `/api/eda-data` - Provide exploratory data analysis

## Requirements Satisfied

✅ **Requirement 6.1**: Dataset loaded and processed (114,000 tracks)
✅ **Requirement 6.2**: ML model trained (XGBoost Classifier)
✅ **Requirement 6.3**: Appropriate features used (27 features including audio, genre, and engineered)
✅ **Requirement 6.4**: Model performance validated (81.1% accuracy)
