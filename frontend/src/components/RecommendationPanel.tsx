import React from 'react';
import type { SimilarTrack } from '../types';
import TrackCard from './TrackCard';

interface RecommendationPanelProps {
  tracks: SimilarTrack[];
  loading: boolean;
  error?: string;
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ tracks, loading, error }) => {
  return (
    <div className="card p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold text-neutral-900 mb-4 font-display">Similar Tracks</h2>
      
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="spinner h-12 w-12 border-primary-600"></div>
            <p className="text-neutral-600 font-medium">Finding similar tracks...</p>
          </div>
        </div>
      )}
      
      {error && !loading && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center p-4 bg-danger-50 border border-danger-200 rounded-xl max-w-sm" role="alert">
            <svg className="w-8 h-8 text-danger-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-danger-800 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}
      
      {!loading && !error && tracks.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-neutral-500">
            <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-8 w-8 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-neutral-700">No recommendations yet</p>
            <p className="text-xs mt-1 text-neutral-500">Submit a prediction to see similar tracks</p>
          </div>
        </div>
      )}
      
      {!loading && !error && tracks.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
          {tracks.map((track, index) => (
            <TrackCard key={`${track.track_name}-${track.artist}-${index}`} track={track} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationPanel;
