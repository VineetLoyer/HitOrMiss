import React from 'react';
import type { SimilarTrack } from '../types';

interface TrackCardProps {
  track: SimilarTrack;
}

const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  // Format similarity score as percentage
  const similarityPercentage = (track.similarity_score * 100).toFixed(1);
  
  // Select key features to display
  const keyFeatures = [
    { name: 'Energy', value: track.features.energy, format: (v: number) => v.toFixed(2) },
    { name: 'Danceability', value: track.features.danceability, format: (v: number) => v.toFixed(2) },
    { name: 'Valence', value: track.features.valence, format: (v: number) => v.toFixed(2) },
    { name: 'Tempo', value: track.features.tempo, format: (v: number) => `${Math.round(v)} BPM` },
  ].filter(f => f.value !== undefined);

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-white rounded-xl p-4 border border-neutral-200 card-hover shadow-soft">
      {/* Track info header */}
      <div className="mb-3">
        <h3 className="font-semibold text-neutral-900 text-sm truncate" title={track.track_name}>
          {track.track_name}
        </h3>
        <p className="text-xs text-neutral-600 truncate flex items-center gap-1" title={track.artist}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          {track.artist}
        </p>
      </div>
      
      {/* Similarity score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-neutral-600 font-medium">Similarity</span>
          <span className="text-xs font-bold text-primary-700">{similarityPercentage}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${similarityPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Key features */}
      {keyFeatures.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200">
          {keyFeatures.map((feature) => (
            <div key={feature.name} className="text-xs">
              <span className="text-neutral-500">{feature.name}</span>
              <p className="font-semibold text-neutral-900">
                {feature.format(feature.value as number)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackCard;
