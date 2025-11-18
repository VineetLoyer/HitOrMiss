import type { TrackFeatures } from '../types';

// Validation ranges for each field
export const validationRanges: Record<
  keyof TrackFeatures,
  { min: number; max: number; label: string }
> = {
  tempo: { min: 0, max: 250, label: 'Tempo' },
  energy: { min: 0, max: 1, label: 'Energy' },
  danceability: { min: 0, max: 1, label: 'Danceability' },
  loudness: { min: -60, max: 0, label: 'Loudness' },
  valence: { min: 0, max: 1, label: 'Valence' },
  acousticness: { min: 0, max: 1, label: 'Acousticness' },
  instrumentalness: { min: 0, max: 1, label: 'Instrumentalness' },
  liveness: { min: 0, max: 1, label: 'Liveness' },
  speechiness: { min: 0, max: 1, label: 'Speechiness' },
  duration_ms: { min: 0, max: 600000, label: 'Duration' },
  key: { min: 0, max: 11, label: 'Key' },
  mode: { min: 0, max: 1, label: 'Mode' },
  time_signature: { min: 3, max: 7, label: 'Time Signature' },
};

/**
 * Validate a single field value
 * @param field Field name
 * @param value Field value
 * @returns Error message if invalid, empty string if valid
 */
export const validateField = (
  field: keyof TrackFeatures,
  value: number | undefined
): string => {
  const range = validationRanges[field];
  
  if (value === undefined || value === null || isNaN(value)) {
    return `${range.label} is required`;
  }
  
  if (value < range.min || value > range.max) {
    return `${range.label} must be between ${range.min} and ${range.max}`;
  }
  
  return '';
};

/**
 * Validate all fields in the form data
 * @param formData Partial track features
 * @returns Object with field names as keys and error messages as values
 */
export const validateAllFields = (
  formData: Partial<TrackFeatures>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Check all required fields
  const requiredFields = Object.keys(validationRanges) as Array<keyof TrackFeatures>;
  
  for (const field of requiredFields) {
    const error = validateField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  }
  
  return errors;
};

/**
 * Check if form is complete and valid
 * @param formData Partial track features
 * @returns True if all fields are present and valid
 */
export const isFormValid = (formData: Partial<TrackFeatures>): boolean => {
  const errors = validateAllFields(formData);
  return Object.keys(errors).length === 0;
};
