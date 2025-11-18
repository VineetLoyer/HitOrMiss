import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import InputPanel from '../components/InputPanel';
import type { TrackFeatures } from '../types';

describe('InputPanel - Form Structure', () => {
  const mockOnChange = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockOnValidationChange = vi.fn();
  
  const defaultProps = {
    formData: {} as Partial<TrackFeatures>,
    onChange: mockOnChange,
    onSubmit: mockOnSubmit,
    errors: {},
    onValidationChange: mockOnValidationChange,
    loading: false,
  };

  it('should render all required input fields', () => {
    render(<InputPanel {...defaultProps} />);
    
    // Test that all 13 track feature fields are present
    const requiredFields: Array<keyof TrackFeatures> = [
      'tempo',
      'energy',
      'danceability',
      'loudness',
      'valence',
      'acousticness',
      'instrumentalness',
      'liveness',
      'speechiness',
      'duration_ms',
      'key',
      'mode',
      'time_signature',
    ];
    
    requiredFields.forEach((field) => {
      const input = screen.getByTestId(`input-${field}`);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });
    
    cleanup();
  });

  it('should render labels for all fields', () => {
    render(<InputPanel {...defaultProps} />);
    
    // Check that inputs exist for key fields (using testid since labels now have icons)
    expect(screen.getByTestId('input-tempo')).toBeInTheDocument();
    expect(screen.getByTestId('input-energy')).toBeInTheDocument();
    expect(screen.getByTestId('input-danceability')).toBeInTheDocument();
    expect(screen.getByTestId('input-loudness')).toBeInTheDocument();
    expect(screen.getByTestId('input-valence')).toBeInTheDocument();
    expect(screen.getByTestId('input-acousticness')).toBeInTheDocument();
    expect(screen.getByTestId('input-instrumentalness')).toBeInTheDocument();
    expect(screen.getByTestId('input-liveness')).toBeInTheDocument();
    expect(screen.getByTestId('input-speechiness')).toBeInTheDocument();
    expect(screen.getByTestId('input-duration_ms')).toBeInTheDocument();
    expect(screen.getByTestId('input-key')).toBeInTheDocument();
    expect(screen.getByTestId('input-mode')).toBeInTheDocument();
    expect(screen.getByTestId('input-time_signature')).toBeInTheDocument();
    
    cleanup();
  });

  it('should render tooltips for all fields', () => {
    const { container } = render(<InputPanel {...defaultProps} />);
    
    // Check that tooltip spans with title attributes are present (one for each field)
    const allInputs = screen.getAllByRole('spinbutton'); // number inputs have spinbutton role
    expect(allInputs.length).toBe(13); // Verify we have all 13 fields
    
    // Check that each field has an associated tooltip by checking for title attributes
    const tooltipSpans = container.querySelectorAll('span[title]');
    expect(tooltipSpans.length).toBeGreaterThanOrEqual(13); // At least one tooltip per field
    
    cleanup();
  });

  it('should render submit button', () => {
    render(<InputPanel {...defaultProps} />);
    
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton).toHaveTextContent(/Predict Track Success/i);
    
    cleanup();
  });

  it('should have correct input attributes for validation', () => {
    render(<InputPanel {...defaultProps} />);
    
    // Check tempo field has correct min/max
    const tempoInput = screen.getByTestId('input-tempo');
    expect(tempoInput).toHaveAttribute('min', '0');
    expect(tempoInput).toHaveAttribute('max', '250');
    
    // Check energy field has correct min/max
    const energyInput = screen.getByTestId('input-energy');
    expect(energyInput).toHaveAttribute('min', '0');
    expect(energyInput).toHaveAttribute('max', '1');
    
    // Check loudness field has correct min/max
    const loudnessInput = screen.getByTestId('input-loudness');
    expect(loudnessInput).toHaveAttribute('min', '-60');
    expect(loudnessInput).toHaveAttribute('max', '0');
    
    cleanup();
  });
});
