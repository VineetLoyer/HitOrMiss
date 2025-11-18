import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import EDATab from '../components/EDATab';
import * as api from '../services/api';
import type { EDAData } from '../types';

// Mock the API module
vi.mock('../services/api');

const mockEDAData: EDAData = {
  feature_distributions: {
    tempo: {
      bins: [0, 50, 100, 150, 200, 250],
      counts: [10, 25, 40, 30, 15],
    },
    energy: {
      bins: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      counts: [5, 15, 30, 35, 25],
    },
    danceability: {
      bins: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      counts: [8, 20, 35, 28, 19],
    },
  },
  correlations: {
    features: ['tempo', 'energy', 'danceability'],
    matrix: [
      [1.0, 0.3, -0.2],
      [0.3, 1.0, 0.5],
      [-0.2, 0.5, 1.0],
    ],
  },
  summary_statistics: {
    tempo: {
      mean: 120.5,
      std: 30.2,
      min: 50.0,
      max: 200.0,
      q25: 95.0,
      q50: 118.0,
      q75: 145.0,
    },
    energy: {
      mean: 0.65,
      std: 0.18,
      min: 0.1,
      max: 1.0,
      q25: 0.52,
      q50: 0.66,
      q75: 0.79,
    },
    danceability: {
      mean: 0.58,
      std: 0.15,
      min: 0.2,
      max: 0.95,
      q25: 0.48,
      q50: 0.59,
      q75: 0.70,
    },
  },
  hit_miss_distribution: {
    hit: 450,
    miss: 550,
  },
};

describe('EDATab - Content Display', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should display loading state initially', () => {
    // Mock API to never resolve
    vi.mocked(api.getEDAData).mockImplementation(() => new Promise(() => {}));

    render(<EDATab />);

    expect(screen.getByText('Loading EDA data...')).toBeInTheDocument();
  });

  it('should display error message when API fails', async () => {
    const errorMessage = 'Failed to load data';
    vi.mocked(api.getEDAData).mockRejectedValue(new Error(errorMessage));

    render(<EDATab />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Data')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should display visualizations when EDA data is loaded', async () => {
    vi.mocked(api.getEDAData).mockResolvedValue(mockEDAData);

    render(<EDATab />);

    await waitFor(() => {
      // Check that main heading is displayed
      expect(screen.getByText('Exploratory Data Analysis')).toBeInTheDocument();
      
      // Check that section headings are displayed
      expect(screen.getByText('Feature Distributions')).toBeInTheDocument();
      expect(screen.getByText('Summary Statistics')).toBeInTheDocument();
      expect(screen.getByText('Feature Correlations')).toBeInTheDocument();
    });
  });

  it('should display statistics correctly', async () => {
    vi.mocked(api.getEDAData).mockResolvedValue(mockEDAData);

    render(<EDATab />);

    await waitFor(() => {
      // Check hit/miss distribution
      expect(screen.getByText('450')).toBeInTheDocument();
      expect(screen.getByText('550')).toBeInTheDocument();
      expect(screen.getByText('Hits')).toBeInTheDocument();
      expect(screen.getByText('Misses')).toBeInTheDocument();
      
      // Check that feature statistics table is present
      expect(screen.getByText('Feature Statistics')).toBeInTheDocument();
      
      // Check that some statistics are displayed (mean values)
      expect(screen.getByText('120.500')).toBeInTheDocument(); // tempo mean
      expect(screen.getByText('0.650')).toBeInTheDocument(); // energy mean
    });
  });

  it('should display correlation matrix', async () => {
    vi.mocked(api.getEDAData).mockResolvedValue(mockEDAData);

    render(<EDATab />);

    await waitFor(() => {
      // Check that correlation matrix section is present
      expect(screen.getByText('Feature Correlations')).toBeInTheDocument();
      
      // Check that color scale legend is present
      expect(screen.getByText('Color Scale:')).toBeInTheDocument();
      expect(screen.getByText('-1 (Negative)')).toBeInTheDocument();
      expect(screen.getByText('+1 (Positive)')).toBeInTheDocument();
    });
  });
});
