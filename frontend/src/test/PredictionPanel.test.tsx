import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import PredictionPanel from '../components/PredictionPanel';
import type { PredictionResult } from '../types';

describe('PredictionPanel - Placeholder Display', () => {
  it('should display placeholder message when no prediction exists', () => {
    render(<PredictionPanel prediction={null} loading={false} />);
    
    const placeholder = screen.getByTestId('prediction-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent(/Enter track details and click "Predict"/i);
    
    cleanup();
  });

  it('should not display placeholder when loading', () => {
    render(<PredictionPanel prediction={null} loading={true} />);
    
    const placeholder = screen.queryByTestId('prediction-placeholder');
    expect(placeholder).not.toBeInTheDocument();
    
    const loading = screen.getByTestId('prediction-loading');
    expect(loading).toBeInTheDocument();
    
    cleanup();
  });

  it('should not display placeholder when error exists', () => {
    render(<PredictionPanel prediction={null} loading={false} error="Test error" />);
    
    const placeholder = screen.queryByTestId('prediction-placeholder');
    expect(placeholder).not.toBeInTheDocument();
    
    const error = screen.getByTestId('prediction-error');
    expect(error).toBeInTheDocument();
    
    cleanup();
  });

  it('should not display placeholder when prediction exists', () => {
    const mockPrediction: PredictionResult = {
      prediction: 'hit',
      confidence: 0.85,
      probabilities: {
        hit: 0.85,
        miss: 0.15,
      },
    };
    
    render(<PredictionPanel prediction={mockPrediction} loading={false} />);
    
    const placeholder = screen.queryByTestId('prediction-placeholder');
    expect(placeholder).not.toBeInTheDocument();
    
    const result = screen.getByTestId('prediction-result');
    expect(result).toBeInTheDocument();
    
    cleanup();
  });
});

describe('PredictionPanel - Loading State', () => {
  it('should display loading spinner when loading is true', () => {
    render(<PredictionPanel prediction={null} loading={true} />);
    
    const loading = screen.getByTestId('prediction-loading');
    expect(loading).toBeInTheDocument();
    expect(loading).toHaveTextContent(/Analyzing track/i);
    
    cleanup();
  });
});

describe('PredictionPanel - Error Display', () => {
  it('should display error message when error prop is provided', () => {
    const errorMessage = 'Failed to generate prediction';
    render(<PredictionPanel prediction={null} loading={false} error={errorMessage} />);
    
    const error = screen.getByTestId('prediction-error');
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(errorMessage);
    
    cleanup();
  });

  it('should style error messages appropriately', () => {
    render(<PredictionPanel prediction={null} loading={false} error="Test error" />);
    
    const error = screen.getByTestId('prediction-error');
    expect(error).toHaveClass('bg-danger-50', 'border-danger-200');
    
    cleanup();
  });
});

describe('PredictionPanel - Prediction Display', () => {
  it('should display hit prediction correctly', () => {
    const mockPrediction: PredictionResult = {
      prediction: 'hit',
      confidence: 0.85,
      probabilities: {
        hit: 0.85,
        miss: 0.15,
      },
    };
    
    render(<PredictionPanel prediction={mockPrediction} loading={false} />);
    
    const label = screen.getByTestId('prediction-label');
    expect(label).toHaveTextContent('HIT');
    
    cleanup();
  });

  it('should display miss prediction correctly', () => {
    const mockPrediction: PredictionResult = {
      prediction: 'miss',
      confidence: 0.72,
      probabilities: {
        hit: 0.28,
        miss: 0.72,
      },
    };
    
    render(<PredictionPanel prediction={mockPrediction} loading={false} />);
    
    const label = screen.getByTestId('prediction-label');
    expect(label).toHaveTextContent('MISS');
    
    cleanup();
  });

  it('should display confidence score as percentage', () => {
    const mockPrediction: PredictionResult = {
      prediction: 'hit',
      confidence: 0.856,
      probabilities: {
        hit: 0.856,
        miss: 0.144,
      },
    };
    
    render(<PredictionPanel prediction={mockPrediction} loading={false} />);
    
    const confidence = screen.getByTestId('confidence-score');
    expect(confidence).toHaveTextContent('85.6%');
    
    cleanup();
  });

  it('should display probability distribution', () => {
    const mockPrediction: PredictionResult = {
      prediction: 'hit',
      confidence: 0.85,
      probabilities: {
        hit: 0.85,
        miss: 0.15,
      },
    };
    
    render(<PredictionPanel prediction={mockPrediction} loading={false} />);
    
    const hitProb = screen.getByTestId('hit-probability');
    expect(hitProb).toHaveTextContent('85.0%');
    
    const missProb = screen.getByTestId('miss-probability');
    expect(missProb).toHaveTextContent('15.0%');
    
    cleanup();
  });
});
