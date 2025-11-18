import type { EDAData } from '../types';

interface SummaryStatisticsProps {
  summaryStatistics: EDAData['summary_statistics'];
  hitMissDistribution: EDAData['hit_miss_distribution'];
}

const SummaryStatistics = ({ summaryStatistics, hitMissDistribution }: SummaryStatisticsProps) => {
  const features = Object.keys(summaryStatistics);

  return (
    <div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-6 font-display flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Summary Statistics
      </h3>
      
      {/* Hit/Miss Distribution */}
      <div className="card p-6 mb-6">
        <h4 className="text-lg font-bold text-neutral-800 mb-4">Hit/Miss Distribution</h4>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="bg-gradient-to-br from-success-50 to-success-100 border-2 border-success-300 rounded-xl p-5 text-center shadow-soft">
            <div className="text-4xl font-bold text-success-700">{hitMissDistribution.hit}</div>
            <div className="text-sm text-neutral-600 mt-2 font-semibold">Hits</div>
          </div>
          <div className="bg-gradient-to-br from-danger-50 to-danger-100 border-2 border-danger-300 rounded-xl p-5 text-center shadow-soft">
            <div className="text-4xl font-bold text-danger-700">{hitMissDistribution.miss}</div>
            <div className="text-sm text-neutral-600 mt-2 font-semibold">Misses</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-neutral-600 font-medium">
          Total tracks: <span className="font-bold text-neutral-900">{hitMissDistribution.hit + hitMissDistribution.miss}</span>
        </div>
      </div>

      {/* Feature Statistics Table */}
      <div className="card p-6 overflow-x-auto">
        <h4 className="text-lg font-bold text-neutral-800 mb-4">Feature Statistics</h4>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-neutral-50 to-neutral-100">
              <th className="border border-neutral-300 p-3 text-left text-sm font-bold text-neutral-700">
                Feature
              </th>
              <th className="border border-neutral-300 p-3 text-center text-sm font-bold text-neutral-700">
                Mean
              </th>
              <th className="border border-neutral-300 p-3 text-center text-sm font-bold text-neutral-700">
                Std Dev
              </th>
              <th className="border border-neutral-300 p-3 text-center text-sm font-bold text-neutral-700">
                Min
              </th>
              <th className="border border-neutral-300 p-3 text-center text-sm font-bold text-neutral-700">
                25%
              </th>
              <th className="border border-neutral-300 p-3 text-center text-sm font-bold text-neutral-700">
                Median
              </th>
              <th className="border border-neutral-300 p-3 text-center text-sm font-bold text-neutral-700">
                75%
              </th>
              <th className="border border-neutral-300 p-3 text-center text-sm font-bold text-neutral-700">
                Max
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => {
              const stats = summaryStatistics[feature];
              return (
                <tr key={feature} className="hover:bg-neutral-50 transition-colors">
                  <td className="border border-neutral-300 p-3 text-sm font-semibold text-neutral-900">
                    {feature.replace(/_/g, ' ')}
                  </td>
                  <td className="border border-neutral-300 p-3 text-center text-sm text-neutral-700">
                    {stats.mean.toFixed(3)}
                  </td>
                  <td className="border border-neutral-300 p-3 text-center text-sm text-neutral-700">
                    {stats.std.toFixed(3)}
                  </td>
                  <td className="border border-neutral-300 p-3 text-center text-sm text-neutral-700">
                    {stats.min.toFixed(3)}
                  </td>
                  <td className="border border-neutral-300 p-3 text-center text-sm text-neutral-700">
                    {stats.q25.toFixed(3)}
                  </td>
                  <td className="border border-neutral-300 p-3 text-center text-sm text-neutral-700">
                    {stats.q50.toFixed(3)}
                  </td>
                  <td className="border border-neutral-300 p-3 text-center text-sm text-neutral-700">
                    {stats.q75.toFixed(3)}
                  </td>
                  <td className="border border-neutral-300 p-3 text-center text-sm text-neutral-700">
                    {stats.max.toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryStatistics;
