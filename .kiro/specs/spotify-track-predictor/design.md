# Design Document

## Overview

The Spotify Track Predictor is a web application that predicts whether a music track will be a hit or miss based on audio features. The application consists of two main sections: an Exploratory Data Analysis (EDA) tab for dataset visualization and a Prediction tab for interactive predictions with similar track recommendations.

The application will be built as a single-page application using React for the frontend and Python (Flask/FastAPI) for the backend. The machine learning model will be trained using scikit-learn on the Kaggle Spotify Tracks Dataset.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌──────────────┐  ┌─────────────────────────────────┐ │
│  │   EDA Tab    │  │       Prediction Tab            │ │
│  │              │  │  ┌────────┐ ┌──────┐ ┌────────┐ │ │
│  │ Visualizations│  │  │ Input  │ │Pred. │ │Recomm. │ │ │
│  │   & Stats    │  │  │ Panel  │ │Panel │ │Panel   │ │ │
│  └──────────────┘  │  │ (1/2)  │ │(1/3) │ │(1/3)   │ │ │
│                     │  └────────┘ └──────┘ └────────┘ │ │
│                     └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                    REST API (HTTP)
                            │
┌─────────────────────────────────────────────────────────┐
│                  Backend (Python/Flask)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ API Routes   │  │ ML Service   │  │ Data Service │ │
│  │              │  │              │  │              │ │
│  │ /predict     │→ │ Model        │→ │ Dataset      │ │
│  │ /similar     │  │ Inference    │  │ Loader       │ │
│  │ /eda-data    │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴────────┐
                    │                │
            ┌───────▼──────┐  ┌─────▼──────┐
            │ Trained Model│  │   Dataset  │
            │   (.pkl)     │  │   (.csv)   │
            └──────────────┘  └────────────┘
```

### Technology Stack

**Frontend:**
- React with TypeScript
- Chart.js or Plotly.js for visualizations
- Tailwind CSS for styling
- Axios for API calls

**Backend:**
- Python 3.9+
- Flask or FastAPI for REST API
- scikit-learn for machine learning
- pandas for data processing
- numpy for numerical operations

**Model:**
- Classification algorithm (Random Forest, Gradient Boosting, or Logistic Regression)
- Feature scaling and preprocessing
- Model serialization with pickle or joblib

## Components and Interfaces

### Frontend Components

#### 1. App Component
- Root component managing tab state
- Routes between EDA and Prediction tabs

#### 2. TabNavigation Component
- Renders tab buttons
- Handles tab switching logic
- Props: `activeTab`, `onTabChange`

#### 3. EDATab Component
- Displays exploratory data analysis
- Fetches EDA data from backend on mount
- Renders multiple visualization components
- State: `edaData`, `loading`, `error`

#### 4. VisualizationChart Component
- Reusable chart component
- Props: `data`, `chartType`, `title`, `xLabel`, `yLabel`
- Supports bar, line, scatter, and histogram charts

#### 5. PredictionTab Component
- Container for the three-panel layout
- Manages prediction state
- Coordinates data flow between panels
- State: `inputData`, `prediction`, `similarTracks`, `loading`, `errors`

#### 6. InputPanel Component
- Form with input fields for track features
- Validates user input
- Props: `onSubmit`, `errors`
- State: `formData`, `validationErrors`

#### 7. PredictionPanel Component
- Displays prediction result
- Shows confidence score
- Props: `prediction`, `confidence`, `loading`

#### 8. RecommendationPanel Component
- Lists similar tracks
- Props: `tracks`, `loading`
- Renders TrackCard components

#### 9. TrackCard Component
- Displays individual track information
- Props: `trackName`, `artist`, `features`

### Backend Components

#### 1. API Routes Module (`routes.py`)

**Endpoints:**

```python
POST /api/predict
Request: {
  "tempo": float,
  "energy": float,
  "danceability": float,
  "loudness": float,
  "valence": float,
  "acousticness": float,
  "instrumentalness": float,
  "liveness": float,
  "speechiness": float,
  "duration_ms": int,
  "key": int,
  "mode": int,
  "time_signature": int
}
Response: {
  "prediction": "hit" | "miss",
  "confidence": float,
  "probabilities": {
    "hit": float,
    "miss": float
  }
}

POST /api/similar
Request: {
  "features": {...},  // Same as predict request
  "n_recommendations": int
}
Response: {
  "similar_tracks": [
    {
      "track_name": string,
      "artist": string,
      "similarity_score": float,
      "features": {...}
    }
  ]
}

GET /api/eda-data
Response: {
  "feature_distributions": {...},
  "correlations": [...],
  "summary_statistics": {...},
  "hit_miss_distribution": {...}
}
```

#### 2. ML Service Module (`ml_service.py`)

**Classes:**

```python
class ModelService:
    def __init__(self, model_path: str):
        self.model = self.load_model(model_path)
        self.scaler = self.load_scaler()
    
    def predict(self, features: dict) -> dict:
        """Generate prediction and confidence scores"""
        pass
    
    def predict_proba(self, features: dict) -> np.ndarray:
        """Get probability distribution"""
        pass
    
    def preprocess_features(self, features: dict) -> np.ndarray:
        """Scale and transform input features"""
        pass
```

#### 3. Data Service Module (`data_service.py`)

**Classes:**

```python
class DataService:
    def __init__(self, dataset_path: str):
        self.df = pd.read_csv(dataset_path)
        self.feature_columns = [...]
    
    def find_similar_tracks(self, features: dict, n: int) -> list:
        """Find n most similar tracks using cosine similarity"""
        pass
    
    def get_eda_data(self) -> dict:
        """Generate EDA statistics and distributions"""
        pass
    
    def get_feature_statistics(self) -> dict:
        """Calculate summary statistics for features"""
        pass
```

#### 4. Model Training Module (`train_model.py`)

**Functions:**

```python
def load_and_prepare_data(filepath: str) -> tuple:
    """Load dataset and split into features and target"""
    pass

def create_target_variable(df: pd.DataFrame) -> pd.Series:
    """Define hit/miss based on popularity threshold"""
    pass

def train_model(X_train, y_train) -> object:
    """Train classification model"""
    pass

def evaluate_model(model, X_test, y_test) -> dict:
    """Calculate accuracy, precision, recall, F1"""
    pass

def save_model(model, scaler, path: str):
    """Serialize model and scaler"""
    pass
```

## Data Models

### Track Features (Input)

```typescript
interface TrackFeatures {
  tempo: number;              // BPM (0-250)
  energy: number;             // 0.0-1.0
  danceability: number;       // 0.0-1.0
  loudness: number;           // dB (-60-0)
  valence: number;            // 0.0-1.0 (mood)
  acousticness: number;       // 0.0-1.0
  instrumentalness: number;   // 0.0-1.0
  liveness: number;           // 0.0-1.0
  speechiness: number;        // 0.0-1.0
  duration_ms: number;        // milliseconds
  key: number;                // 0-11 (pitch class)
  mode: number;               // 0 or 1 (major/minor)
  time_signature: number;     // 3-7
}
```

### Prediction Result

```typescript
interface PredictionResult {
  prediction: 'hit' | 'miss';
  confidence: number;         // 0.0-1.0
  probabilities: {
    hit: number;
    miss: number;
  };
}
```

### Similar Track

```typescript
interface SimilarTrack {
  track_name: string;
  artist: string;
  similarity_score: number;   // 0.0-1.0
  features: Partial<TrackFeatures>;
}
```

### EDA Data

```typescript
interface EDAData {
  feature_distributions: {
    [feature: string]: {
      bins: number[];
      counts: number[];
    };
  };
  correlations: {
    features: string[];
    matrix: number[][];
  };
  summary_statistics: {
    [feature: string]: {
      mean: number;
      std: number;
      min: number;
      max: number;
      q25: number;
      q50: number;
      q75: number;
    };
  };
  hit_miss_distribution: {
    hit: number;
    miss: number;
  };
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Tab switching displays correct content
*For any* tab (EDA or Prediction), when a user clicks on that tab, the system should display the content associated with that tab and hide content from other tabs.
**Validates: Requirements 1.2, 1.3**

### Property 2: Tab state preservation
*For any* sequence of tab switches and user interactions, when switching away from a tab and then back to it, all user-entered data and UI state should be preserved exactly as it was before switching.
**Validates: Requirements 1.4**

### Property 3: Active tab visual indication
*For any* tab that is currently active, the system should apply a visual indicator (such as a CSS class or style) that distinguishes it from inactive tabs.
**Validates: Requirements 1.5**

### Property 4: Input validation
*For any* input field and any user input value, when the value is outside the acceptable range for that field, the system should reject the input and display a validation error message.
**Validates: Requirements 3.3, 3.4**

### Property 5: Layout proportions maintained
*For any* viewport size above the minimum supported width, the Input Panel should occupy 50% of the Prediction tab width, while the Prediction Panel and Recommendation Panel should each occupy approximately 33% of the remaining width.
**Validates: Requirements 3.1, 4.1, 5.1, 7.3**

### Property 6: Prediction output structure
*For any* valid track feature input, when a prediction is generated, the result should contain exactly one of "hit" or "miss" as the prediction value, and a confidence score between 0.0 and 1.0.
**Validates: Requirements 4.2, 4.3, 4.4**

### Property 7: Similar tracks structure and count
*For any* prediction request, when similar tracks are returned, the system should return between 3 and 10 tracks, and each track should include track_name, artist, and feature values.
**Validates: Requirements 5.2, 5.3, 5.4**

### Property 8: Responsive layout adjustment
*For any* browser window resize event, the system should adjust the layout to maintain the specified proportions and ensure all content remains accessible and readable.
**Validates: Requirements 7.2**

### Property 9: Interactive feedback
*For any* user interaction with clickable elements (buttons, tabs, form submissions), the system should provide immediate visual feedback through state changes, CSS class updates, or loading indicators.
**Validates: Requirements 7.5**

### Property 10: Error message display
*For any* error condition (prediction failure, network failure, validation error), the system should display a user-friendly error message that explains the problem without exposing technical implementation details.
**Validates: Requirements 8.1, 8.4, 8.5**

## Error Handling

### Frontend Error Handling

1. **Input Validation Errors**
   - Validate all inputs client-side before submission
   - Display inline error messages next to invalid fields
   - Prevent form submission until all validations pass
   - Provide clear guidance on acceptable value ranges

2. **API Request Errors**
   - Implement try-catch blocks around all API calls
   - Display user-friendly error messages in the UI
   - Implement retry logic for transient network failures (max 3 retries with exponential backoff)
   - Show loading states during API calls

3. **Rendering Errors**
   - Use React Error Boundaries to catch rendering errors
   - Display fallback UI when components fail to render
   - Log errors to console for debugging

### Backend Error Handling

1. **Input Validation**
   - Validate all incoming request data against expected schema
   - Return 400 Bad Request with descriptive error messages for invalid inputs
   - Check feature values are within acceptable ranges

2. **Model Prediction Errors**
   - Wrap model inference in try-catch blocks
   - Return 500 Internal Server Error if model fails
   - Log detailed error information for debugging
   - Ensure model and scaler are loaded correctly on startup

3. **Data Loading Errors**
   - Validate dataset file exists and is readable on startup
   - Fail fast if dataset cannot be loaded
   - Provide clear error messages about missing or corrupted data files

4. **Resource Errors**
   - Handle file not found errors for model and dataset files
   - Implement graceful degradation if optional features fail
   - Return appropriate HTTP status codes (404, 500, etc.)

### Error Response Format

All API errors should follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input: tempo must be between 0 and 250",
    "field": "tempo"
  }
}
```

## Testing Strategy

### Unit Testing

**Frontend Unit Tests:**
- Test individual React components in isolation
- Test form validation logic
- Test API service functions
- Test utility functions for data transformation
- Use React Testing Library for component tests
- Mock API calls using jest.mock or MSW (Mock Service Worker)

**Backend Unit Tests:**
- Test API endpoint handlers
- Test data preprocessing functions
- Test similarity calculation algorithms
- Test model loading and inference functions
- Use pytest for Python tests
- Mock external dependencies (file I/O, model objects)

**Key Unit Test Cases:**
- Initial application load shows correct default state (Requirements 1.1, 4.5, 5.5)
- EDA tab displays all required visualizations (Requirements 2.1, 2.2, 2.3)
- Input form contains all required fields (Requirements 3.2, 3.5)
- Dataset loads successfully on backend startup (Requirements 6.1)
- Model training completes and produces valid model (Requirements 6.2, 6.3, 6.4)
- Dataset load failure shows error message (Requirements 8.2)
- Model prediction failure shows error in Prediction Panel (Requirements 8.3)

### Property-Based Testing

**Property-Based Testing Framework:**
- Frontend: fast-check (JavaScript/TypeScript property-based testing library)
- Backend: Hypothesis (Python property-based testing library)

**Configuration:**
- Each property-based test should run a minimum of 100 iterations
- Each test must be tagged with a comment referencing the correctness property from this design document
- Tag format: `// Feature: spotify-track-predictor, Property {number}: {property_text}`

**Property-Based Test Implementation:**

Each correctness property listed above must be implemented as a single property-based test:

1. **Property 1 Test**: Generate random tab selections, verify correct content displays
2. **Property 2 Test**: Generate random sequences of tab switches with data entry, verify state preservation
3. **Property 3 Test**: Generate random tab states, verify active tab has visual indicator
4. **Property 4 Test**: Generate random input values (valid and invalid), verify validation behavior
5. **Property 5 Test**: Generate random viewport sizes, verify layout proportions
6. **Property 6 Test**: Generate random valid track features, verify prediction output structure
7. **Property 7 Test**: Generate random track features, verify similar tracks structure and count
8. **Property 8 Test**: Generate random window resize events, verify layout adjusts correctly
9. **Property 9 Test**: Generate random user interactions, verify visual feedback occurs
10. **Property 10 Test**: Generate random error conditions, verify error messages display correctly

**Test Data Generators:**

For property-based tests, we need generators for:
- Valid track features (within acceptable ranges)
- Invalid track features (outside acceptable ranges)
- Random tab sequences
- Random viewport dimensions
- Random user interaction events

### Integration Testing

- Test complete user flows from input to prediction
- Test API integration between frontend and backend
- Test model inference pipeline end-to-end
- Verify data flows correctly through all layers

### Performance Testing

- Test prediction response time (should be < 500ms)
- Test similar tracks calculation time (should be < 1s)
- Test EDA data generation time (should be < 2s)
- Test application load time (should be < 3s)

## Deployment Considerations

### Model Training and Deployment

1. **Training Pipeline:**
   - Load Kaggle Spotify dataset
   - Define hit/miss target based on popularity threshold (e.g., top 30% = hit)
   - Split data into train/test sets (80/20)
   - Train classification model (Random Forest or Gradient Boosting)
   - Evaluate model performance (accuracy, precision, recall, F1)
   - Save trained model and scaler to disk

2. **Model Artifacts:**
   - Serialized model file (`.pkl` or `.joblib`)
   - Serialized scaler file for feature normalization
   - Feature names and order configuration
   - Model metadata (version, training date, performance metrics)

### Application Deployment

1. **Frontend:**
   - Build React application for production
   - Serve static files via CDN or web server
   - Configure API endpoint URLs for production

2. **Backend:**
   - Deploy Flask/FastAPI application to cloud platform (AWS, GCP, Heroku)
   - Ensure model and dataset files are accessible
   - Configure CORS for frontend-backend communication
   - Set up logging and monitoring

3. **Environment Variables:**
   - `MODEL_PATH`: Path to trained model file
   - `DATASET_PATH`: Path to Spotify dataset CSV
   - `API_PORT`: Backend server port
   - `CORS_ORIGINS`: Allowed frontend origins

## Future Enhancements

1. **Model Improvements:**
   - Experiment with different algorithms (XGBoost, Neural Networks)
   - Implement hyperparameter tuning
   - Add feature engineering (interaction terms, polynomial features)
   - Implement model versioning and A/B testing

2. **Feature Additions:**
   - Allow users to upload audio files for automatic feature extraction
   - Add historical trend analysis
   - Implement user accounts to save predictions
   - Add social sharing of predictions

3. **UI/UX Improvements:**
   - Add dark mode
   - Implement advanced filtering in EDA tab
   - Add interactive tooltips explaining features
   - Implement comparison mode to compare multiple tracks

4. **Performance Optimizations:**
   - Cache EDA data on frontend
   - Implement request debouncing for real-time predictions
   - Add service worker for offline functionality
   - Optimize dataset loading with lazy loading or database
