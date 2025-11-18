// Type definitions for the Spotify Track Predictor

export interface TrackFeatures {
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

export interface PredictionResult {
  prediction: 'hit' | 'miss';
  confidence: number;         // 0.0-1.0
  probabilities: {
    hit: number;
    miss: number;
  };
}

export interface SimilarTrack {
  track_name: string;
  artist: string;
  similarity_score: number;   // 0.0-1.0
  features: Partial<TrackFeatures>;
}

export interface EDAData {
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
