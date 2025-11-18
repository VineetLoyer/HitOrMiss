import React from 'react';

export type Tab = 'eda' | 'prediction';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-neutral-200 bg-white rounded-t-xl shadow-soft">
      <nav className="flex space-x-1 px-4" aria-label="Tabs" role="tablist">
        <button
          onClick={() => onTabChange('eda')}
          className={`py-4 px-6 border-b-2 font-semibold text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-t-lg
            ${
            activeTab === 'eda'
              ? 'border-primary-600 text-primary-700 bg-primary-50'
              : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 active:text-neutral-900'
          }`}
          aria-current={activeTab === 'eda' ? 'page' : undefined}
          aria-selected={activeTab === 'eda'}
          role="tab"
          data-testid="tab-eda"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            EDA
          </span>
        </button>
        <button
          onClick={() => onTabChange('prediction')}
          className={`py-4 px-6 border-b-2 font-semibold text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-t-lg
            ${
            activeTab === 'prediction'
              ? 'border-primary-600 text-primary-700 bg-primary-50'
              : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 active:text-neutral-900'
          }`}
          aria-current={activeTab === 'prediction' ? 'page' : undefined}
          aria-selected={activeTab === 'prediction'}
          role="tab"
          data-testid="tab-prediction"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Prediction
          </span>
        </button>
      </nav>
    </div>
  );
};

export default TabNavigation;
