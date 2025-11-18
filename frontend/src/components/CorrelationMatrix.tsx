import type { EDAData } from '../types';

interface CorrelationMatrixProps {
  correlations: EDAData['correlations'];
}

const CorrelationMatrix = ({ correlations }: CorrelationMatrixProps) => {
  const { features, matrix } = correlations;

  // Helper function to get color based on correlation value
  const getColor = (value: number): string => {
    // Normalize value from [-1, 1] to [0, 1]
    const normalized = (value + 1) / 2;
    
    if (value > 0) {
      // Positive correlation: white to blue
      const intensity = Math.floor(normalized * 255);
      return `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
    } else {
      // Negative correlation: white to red
      const intensity = Math.floor((1 - normalized) * 255);
      return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-6 font-display flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
        </svg>
        Feature Correlations
      </h3>
      <div className="card p-6 overflow-x-auto">
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <span className="text-neutral-700 font-semibold">Color Scale:</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-200 border-2 border-neutral-300 rounded"></div>
            <span className="text-neutral-600 font-medium">-1 (Negative)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white border-2 border-neutral-300 rounded"></div>
            <span className="text-neutral-600 font-medium">0 (No correlation)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-200 border-2 border-neutral-300 rounded"></div>
            <span className="text-neutral-600 font-medium">+1 (Positive)</span>
          </div>
        </div>
        
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-neutral-300 p-2 bg-gradient-to-br from-neutral-50 to-neutral-100"></th>
              {features.map((feature) => (
                <th
                  key={feature}
                  className="border border-neutral-300 p-2 bg-gradient-to-br from-neutral-50 to-neutral-100 text-xs font-bold text-neutral-700 min-w-[80px]"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {feature.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((rowFeature, rowIdx) => (
              <tr key={rowFeature}>
                <td className="border border-neutral-300 p-2 bg-gradient-to-br from-neutral-50 to-neutral-100 text-xs font-bold text-neutral-700 whitespace-nowrap">
                  {rowFeature.replace(/_/g, ' ')}
                </td>
                {features.map((colFeature, colIdx) => {
                  const value = matrix[rowIdx][colIdx];
                  return (
                    <td
                      key={colFeature}
                      className="border border-neutral-300 p-2 text-center text-xs font-semibold transition-all hover:scale-110 cursor-help"
                      style={{ backgroundColor: getColor(value) }}
                      title={`${rowFeature} vs ${colFeature}: ${value.toFixed(3)}`}
                    >
                      {value.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CorrelationMatrix;
