import React from 'react';
import type { PredictionResult } from '../types';

interface PredictionPanelProps {
  prediction: PredictionResult | null;
  loading: boolean;
  error?: string;
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({ prediction, loading, error }) => {
  return (
    <div className="card p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold text-neutral-900 mb-4 font-display">Prediction</h2>
      
      {/* Loading state */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center py-8" data-testid="prediction-loading">
          <div className="spinner h-12 w-12 border-primary-600"></div>
          <p className="mt-4 text-neutral-600 font-medium">Analyzing track...</p>
        </div>
      )}
      
      {/* Error state */}
      {!loading && error && (
        <div 
          className="bg-danger-50 border border-danger-200 rounded-xl p-4 flex items-start gap-3"
          data-testid="prediction-error"
          role="alert"
        >
          <svg className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-danger-800 text-sm font-medium">{error}</p>
        </div>
      )}
      
      {/* Placeholder state - no prediction yet */}
      {!loading && !error && !prediction && (
        <div 
          className="flex-1 flex flex-col items-center justify-center py-8 text-center"
          data-testid="prediction-placeholder"
        >
          <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-neutral-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
          </div>
          <p className="text-neutral-600 text-sm max-w-xs">
            Enter track details and click "Predict" to see if your track will be a hit or miss
          </p>
        </div>
      )}
      
      {/* Prediction result */}
      {!loading && !error && prediction && (
        <div data-testid="prediction-result" className="flex-1 flex flex-col">
          {/* Main prediction result */}
          <div className="text-center mb-6">
            <div 
              className={`inline-block px-8 py-5 rounded-2xl shadow-medium ${
                prediction.prediction === 'hit' 
                  ? 'bg-gradient-to-br from-success-50 to-success-100 border-2 border-success-500' 
                  : 'bg-gradient-to-br from-danger-50 to-danger-100 border-2 border-danger-500'
              }`}
              data-testid="prediction-label"
            >
              <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-1">Prediction</p>
              <p 
                className={`text-4xl font-bold ${
                  prediction.prediction === 'hit' ? 'text-success-700' : 'text-danger-700'
                }`}
              >
                {prediction.prediction.toUpperCase()}
              </p>
            </div>
          </div>
          
          {/* Confidence score */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-neutral-700">Confidence</span>
              <span 
                className="text-lg font-bold text-neutral-900"
                data-testid="confidence-score"
              >
                {(prediction.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  prediction.prediction === 'hit' ? 'bg-gradient-to-r from-success-500 to-success-600' : 'bg-gradient-to-r from-danger-500 to-danger-600'
                }`}
                style={{ width: `${prediction.confidence * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Probability distribution */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-700 mb-3">Probability Distribution</p>
            <div className="space-y-4">
              {/* Hit probability */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-neutral-600 font-medium">Hit</span>
                  <span 
                    className="text-sm font-bold text-neutral-900"
                    data-testid="hit-probability"
                  >
                    {(prediction.probabilities.hit * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-success-500 to-success-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${prediction.probabilities.hit * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Miss probability */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-neutral-600 font-medium">Miss</span>
                  <span 
                    className="text-sm font-bold text-neutral-900"
                    data-testid="miss-probability"
                  >
                    {(prediction.probabilities.miss * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-danger-500 to-danger-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${prediction.probabilities.miss * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;
