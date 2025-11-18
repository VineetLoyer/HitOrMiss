import React, { useEffect } from 'react';
import type { TrackFeatures } from '../types';
import { validateField } from '../utils/validation';

interface InputPanelProps {
  formData: Partial<TrackFeatures>;
  onChange: (field: keyof TrackFeatures, value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: Record<string, string>;
  onValidationChange: (errors: Record<string, string>) => void;
  loading: boolean;
}

// Field configuration with labels, tooltips, and validation ranges
const fieldConfig: Array<{
  name: keyof TrackFeatures;
  label: string;
  tooltip: string;
  min: number;
  max: number;
  step: number;
}> = [
  {
    name: 'tempo',
    label: 'Tempo (BPM)',
    tooltip: 'The overall estimated tempo of a track in beats per minute (BPM)',
    min: 0,
    max: 250,
    step: 1,
  },
  {
    name: 'energy',
    label: 'Energy',
    tooltip: 'Represents a perceptual measure of intensity and activity (0.0 to 1.0)',
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    name: 'danceability',
    label: 'Danceability',
    tooltip: 'Describes how suitable a track is for dancing (0.0 to 1.0)',
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    name: 'loudness',
    label: 'Loudness (dB)',
    tooltip: 'The overall loudness of a track in decibels (-60 to 0)',
    min: -60,
    max: 0,
    step: 0.1,
  },
  {
    name: 'valence',
    label: 'Valence',
    tooltip: 'Musical positiveness conveyed by a track (0.0 to 1.0)',
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    name: 'acousticness',
    label: 'Acousticness',
    tooltip: 'Confidence measure of whether the track is acoustic (0.0 to 1.0)',
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    name: 'instrumentalness',
    label: 'Instrumentalness',
    tooltip: 'Predicts whether a track contains no vocals (0.0 to 1.0)',
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    name: 'liveness',
    label: 'Liveness',
    tooltip: 'Detects the presence of an audience in the recording (0.0 to 1.0)',
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    name: 'speechiness',
    label: 'Speechiness',
    tooltip: 'Detects the presence of spoken words in a track (0.0 to 1.0)',
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    name: 'duration_ms',
    label: 'Duration (ms)',
    tooltip: 'The duration of the track in milliseconds',
    min: 0,
    max: 600000,
    step: 1000,
  },
  {
    name: 'key',
    label: 'Key',
    tooltip: 'The key the track is in (0-11, using standard Pitch Class notation)',
    min: 0,
    max: 11,
    step: 1,
  },
  {
    name: 'mode',
    label: 'Mode',
    tooltip: 'Indicates the modality (major or minor) of a track (0 = minor, 1 = major)',
    min: 0,
    max: 1,
    step: 1,
  },
  {
    name: 'time_signature',
    label: 'Time Signature',
    tooltip: 'An estimated overall time signature of a track (3-7)',
    min: 3,
    max: 7,
    step: 1,
  },
];

const InputPanel: React.FC<InputPanelProps> = ({
  formData,
  onChange,
  onSubmit,
  errors,
  onValidationChange,
  loading,
}) => {
  // Validate all fields whenever formData changes
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    fieldConfig.forEach((field) => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    onValidationChange(newErrors);
  }, [formData, onValidationChange]);

  const handleInputChange = (field: keyof TrackFeatures, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange(field, numValue);
    } else if (value === '') {
      // Allow clearing the field
      onChange(field, undefined as any);
    }
  };

  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 font-display">Track Details</h2>
        <p className="text-sm text-neutral-600 mt-1">Enter the audio features of your track</p>
      </div>
      
      <form onSubmit={onSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 max-h-[600px] overflow-y-auto pr-2 space-y-4 scrollbar-thin">
          {fieldConfig.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label
                htmlFor={field.name}
                className="text-sm font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5"
                title={field.tooltip}
              >
                {field.label}
                <span 
                  className="inline-flex items-center justify-center w-4 h-4 text-xs text-neutral-500 hover:text-primary-600 cursor-help transition-colors" 
                  title={field.tooltip}
                  aria-label={field.tooltip}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </span>
              </label>
              
              <input
                type="number"
                id={field.name}
                name={field.name}
                value={formData[field.name] ?? ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                min={field.min}
                max={field.max}
                step={field.step}
                className={`
                  input
                  ${errors[field.name] ? 'input-error' : ''}
                  disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:hover:border-neutral-300
                `}
                disabled={loading}
                data-testid={`input-${field.name}`}
                aria-invalid={!!errors[field.name]}
                aria-describedby={errors[field.name] ? `error-${field.name}` : undefined}
              />
              
              {errors[field.name] && (
                <span 
                  id={`error-${field.name}`}
                  className="text-sm text-danger-600 mt-1 flex items-center gap-1" 
                  data-testid={`error-${field.name}`}
                  role="alert"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-6 mt-6 border-t border-neutral-200">
          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className={`
              w-full py-3.5 px-4 rounded-xl font-semibold text-white
              transition-all duration-200 flex items-center justify-center gap-2
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              shadow-medium
              ${
                loading || Object.keys(errors).length > 0
                  ? 'bg-neutral-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 hover:shadow-strong active:scale-95 transform'
              }
            `}
            data-testid="submit-button"
            aria-busy={loading}
          >
            {loading && (
              <div className="spinner h-5 w-5 border-white"></div>
            )}
            {loading ? 'Predicting...' : 'Predict Track Success'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputPanel;
