import VisualizationChart from './VisualizationChart';
import type { EDAData } from '../types';

interface FeatureDistributionsProps {
  featureDistributions: EDAData['feature_distributions'];
}

const FeatureDistributions = ({ featureDistributions }: FeatureDistributionsProps) => {
  const features = Object.keys(featureDistributions);

  return (
    <div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-6 font-display flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Feature Distributions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const distribution = featureDistributions[feature];
          
          // Create labels from bins (use bin centers or ranges)
          const labels = distribution.bins.map((bin, idx) => {
            if (idx < distribution.bins.length - 1) {
              return `${bin.toFixed(2)}-${distribution.bins[idx + 1].toFixed(2)}`;
            }
            return `${bin.toFixed(2)}+`;
          });

          const chartData = {
            labels: labels.slice(0, distribution.counts.length),
            datasets: [
              {
                label: 'Frequency',
                data: distribution.counts,
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderColor: 'rgba(22, 163, 74, 1)',
                borderWidth: 2,
              },
            ],
          };

          return (
            <div key={feature} className="card p-5 card-hover">
              <VisualizationChart
                data={chartData}
                chartType="histogram"
                title={feature.replace(/_/g, ' ').toUpperCase()}
                xLabel="Value Range"
                yLabel="Frequency"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureDistributions;
