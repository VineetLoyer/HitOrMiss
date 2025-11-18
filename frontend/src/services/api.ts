import axios, { AxiosError } from 'axios';
import type { TrackFeatures, PredictionResult, SimilarTrack, EDAData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to determine if error is retryable
const isRetryableError = (error: AxiosError): boolean => {
  if (!error.response) {
    // Network errors (no response received)
    return true;
  }
  // Retry on 5xx server errors and 429 (too many requests)
  const status = error.response.status;
  return status >= 500 || status === 429;
};

// Generic retry wrapper with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Log retry attempt (for debugging, not exposed to users)
      console.error(`Request attempt ${attempt + 1} failed:`, error);
      
      // Check if we should retry
      if (error instanceof AxiosError && isRetryableError(error)) {
        if (attempt < retries - 1) {
          // Exponential backoff: 1s, 2s, 4s
          const delayMs = RETRY_DELAY * Math.pow(2, attempt);
          console.log(`Retrying in ${delayMs}ms... (attempt ${attempt + 2}/${retries})`);
          await delay(delayMs);
          continue;
        }
      }
      
      // If not retryable or last attempt, throw
      console.error(`Request failed after ${attempt + 1} attempt(s)`);
      throw error;
    }
  }
  
  throw lastError!;
}

// Error handler to format error messages
const handleApiError = (error: unknown): never => {
  // Log full error details to console for debugging (not exposed to users)
  console.error('API Error:', error);
  
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error
      // Log technical details
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // Return user-friendly message (no technical details)
      const message = error.response.data?.error?.message || error.response.data?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      console.error('No response received from server');
      throw new Error('Network error: Unable to reach the server. Please check your connection.');
    }
  }
  
  // Log unexpected errors
  console.error('Unexpected error type:', typeof error);
  throw new Error('An unexpected error occurred');
};

/**
 * Predict whether a track will be a hit or miss
 * @param features Track features for prediction
 * @returns Prediction result with confidence scores
 */
export const predictTrack = async (features: TrackFeatures): Promise<PredictionResult> => {
  try {
    return await withRetry(async () => {
      const response = await apiClient.post<PredictionResult>('/predict', features);
      return response.data;
    });
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get similar tracks from the dataset
 * @param features Track features to find similar tracks
 * @param n Number of recommendations (default: 5)
 * @returns Array of similar tracks
 */
export const getSimilarTracks = async (
  features: TrackFeatures,
  n: number = 5
): Promise<SimilarTrack[]> => {
  try {
    return await withRetry(async () => {
      const response = await apiClient.post<{ similar_tracks: SimilarTrack[] }>(
        '/similar',
        { features, n_recommendations: n }
      );
      return response.data.similar_tracks;
    });
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get exploratory data analysis data
 * @returns EDA data including distributions, correlations, and statistics
 */
export const getEDAData = async (): Promise<EDAData> => {
  try {
    return await withRetry(async () => {
      const response = await apiClient.get<EDAData>('/eda-data');
      return response.data;
    });
  } catch (error) {
    return handleApiError(error);
  }
};

export default apiClient;
