import React, { useState, useCallback } from 'react';
import type { TrackFeatures, PredictionResult, SimilarTrack } from '../types';
import InputPanel from './InputPanel';
import PredictionPanel from './PredictionPanel';
import RecommendationPanel from './RecommendationPanel';
import { predictTrack, getSimilarTracks } from '../services/api';

const PredictionTab: React.FC = () => {
  const [inputData, setInputData] = useState<Partial<TrackFeatures>>({});
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [similarTracks, setSimilarTracks] = useState<SimilarTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>('');
  const [similarError, setSimilarError] = useState<string>('');

  const handleFieldChange = useCallback((field: keyof TrackFeatures, value: number) => {
    setInputData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleValidationChange = useCallback((validationErrors: Record<string, string>) => {
    setErrors(validationErrors);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setApiError('');
    
    // Check if form is valid
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    // Check if all fields are filled
    const requiredFields: Array<keyof TrackFeatures> = [
      'tempo', 'energy', 'danceability', 'loudness', 'valence',
      'acousticness', 'instrumentalness', 'liveness', 'speechiness',
      'duration_ms', 'key', 'mode', 'time_signature'
    ];
    
    const missingFields = requiredFields.filter(field => inputData[field] === undefined);
    if (missingFields.length > 0) {
      setApiError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await predictTrack(inputData as TrackFeatures);
      setPrediction(result);
      
      // Fetch similar tracks after successful prediction
      setLoadingSimilar(true);
      setSimilarError('');
      try {
        const similar = await getSimilarTracks(inputData as TrackFeatures, 5);
        setSimilarTracks(similar);
      } catch (similarErr) {
        const errorMessage = similarErr instanceof Error ? similarErr.message : 'Failed to get similar tracks';
        setSimilarError(errorMessage);
        setSimilarTracks([]);
      } finally {
        setLoadingSimilar(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get prediction';
      setApiError(errorMessage);
      setPrediction(null);
      setSimilarTracks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in"
      data-testid="prediction-tab-layout"
    >
      {/* Input Panel - Left half (1/2) */}
      <div 
        className="lg:col-span-1"
        data-testid="input-panel"
      >
        <InputPanel
          formData={inputData}
          onChange={handleFieldChange}
          onSubmit={handleSubmit}
          errors={errors}
          onValidationChange={handleValidationChange}
          loading={loading}
        />
        {apiError && (
          <div 
            className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-xl flex items-start gap-3 animate-slide-up"
            data-testid="api-error-message"
            role="alert"
          >
            <svg className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-danger-800 text-sm font-medium">{apiError}</p>
          </div>
        )}
      </div>

      {/* Right side - Prediction and Recommendation panels (1/3 each) */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Prediction Panel - Top right (1/3) */}
        <div 
          className="flex-1 min-h-[300px]"
          data-testid="prediction-panel"
        >
          <PredictionPanel
            prediction={prediction}
            loading={loading}
            error={apiError}
          />
        </div>

        {/* Recommendation Panel - Bottom right (1/3) */}
        <div 
          className="flex-1 min-h-[300px]"
          data-testid="recommendation-panel"
        >
          <RecommendationPanel
            tracks={similarTracks}
            loading={loadingSimilar}
            error={similarError}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictionTab;
