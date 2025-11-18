import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import RecommendationPanel from '../components/RecommendationPanel';
import type { SimilarTrack } from '../types';

describe('RecommendationPanel - Placeholder Display', () => {
  it('should display placeholder message when no recommendations exist', () => {
    render(<RecommendationPanel tracks={[]} loading={false} />);
    
    const placeholder = screen.getByText(/No recommendations yet/i);
    expect(placeholder).toBeInTheDocument();
    
    const instruction = screen.getByText(/Submit a prediction to see similar tracks/i);
    expect(instruction).toBeInTheDocument();
    
    cleanup();
  });

  it('should not display placeholder when loading', () => {
    render(<RecommendationPanel tracks={[]} loading={true} />);
    
    const placeholder = screen.queryByText(/No recommendations yet/i);
    expect(placeholder).not.toBeInTheDocument();
    
    const loading = screen.getByText(/Finding similar tracks/i);
    expect(loading).toBeInTheDocument();
    
    cleanup();
  });

  it('should not display placeholder when error exists', () => {
    render(<RecommendationPanel tracks={[]} loading={false} error="Test error" />);
    
    const placeholder = screen.queryByText(/No recommendations yet/i);
    expect(placeholder).not.toBeInTheDocument();
    
    const error = screen.getByText(/Test error/i);
    expect(error).toBeInTheDocument();
    
    cleanup();
  });

  it('should not display placeholder when tracks exist', () => {
    const mockTracks: SimilarTrack[] = [
      {
        track_name: 'Test Track',
        artist: 'Test Artist',
        similarity_score: 0.95,
        features: {
          energy: 0.8,
          danceability: 0.7,
        },
      },
    ];
    
    render(<RecommendationPanel tracks={mockTracks} loading={false} />);
    
    const placeholder = screen.queryByText(/No recommendations yet/i);
    expect(placeholder).not.toBeInTheDocument();
    
    const trackName = screen.getByText('Test Track');
    expect(trackName).toBeInTheDocument();
    
    cleanup();
  });
});

describe('RecommendationPanel - Loading State', () => {
  it('should display loading spinner when loading is true', () => {
    render(<RecommendationPanel tracks={[]} loading={true} />);
    
    const loading = screen.getByText(/Finding similar tracks/i);
    expect(loading).toBeInTheDocument();
    
    cleanup();
  });
});

describe('RecommendationPanel - Error Display', () => {
  it('should display error message when error prop is provided', () => {
    const errorMessage = 'Failed to fetch similar tracks';
    render(<RecommendationPanel tracks={[]} loading={false} error={errorMessage} />);
    
    const error = screen.getByText(errorMessage);
    expect(error).toBeInTheDocument();
    
    cleanup();
  });
});

describe('RecommendationPanel - Track Display', () => {
  it('should display list of similar tracks', () => {
    const mockTracks: SimilarTrack[] = [
      {
        track_name: 'Track 1',
        artist: 'Artist 1',
        similarity_score: 0.95,
        features: {
          energy: 0.8,
          danceability: 0.7,
        },
      },
      {
        track_name: 'Track 2',
        artist: 'Artist 2',
        similarity_score: 0.88,
        features: {
          energy: 0.6,
          danceability: 0.9,
        },
      },
    ];
    
    render(<RecommendationPanel tracks={mockTracks} loading={false} />);
    
    expect(screen.getByText('Track 1')).toBeInTheDocument();
    expect(screen.getByText('Artist 1')).toBeInTheDocument();
    expect(screen.getByText('Track 2')).toBeInTheDocument();
    expect(screen.getByText('Artist 2')).toBeInTheDocument();
    
    cleanup();
  });
});
