import { useState, useEffect } from 'react';
import { getEDAData } from '../services/api';
import type { EDAData } from '../types';
import FeatureDistributions from './FeatureDistributions';
import CorrelationMatrix from './CorrelationMatrix';
import SummaryStatistics from './SummaryStatistics';

const EDATab = () => {
  const [edaData, setEdaData] = useState<EDAData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEDAData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEDAData();
        setEdaData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load EDA data');
      } finally {
        setLoading(false);
      }
    };

    fetchEDAData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600 font-medium">Loading EDA data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-50 border border-danger-200 rounded-xl p-6 flex items-start gap-3" role="alert">
        <svg className="w-6 h-6 text-danger-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <div>
          <h3 className="text-danger-800 font-bold mb-1">Error Loading Data</h3>
          <p className="text-danger-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!edaData) {
    return (
      <div className="text-center text-neutral-600 py-8">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="text-3xl font-bold text-neutral-900 mb-2 font-display">Exploratory Data Analysis</h2>
        <p className="text-neutral-600">
          Explore the characteristics and patterns in the Spotify tracks dataset
        </p>
      </div>

      {/* Feature Distributions */}
      <FeatureDistributions featureDistributions={edaData.feature_distributions} />

      {/* Summary Statistics */}
      <SummaryStatistics 
        summaryStatistics={edaData.summary_statistics}
        hitMissDistribution={edaData.hit_miss_distribution}
      />

      {/* Correlation Matrix */}
      <CorrelationMatrix correlations={edaData.correlations} />
    </div>
  );
};

export default EDATab;
