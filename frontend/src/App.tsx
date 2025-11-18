import { useState } from 'react'
import './App.css'
import TabNavigation, { type Tab } from './components/TabNavigation'
import EDATab from './components/EDATab'
import PredictionTab from './components/PredictionTab'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('eda');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        {/* Header */}
        <header className="bg-white shadow-soft border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-medium">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 font-display">Spotify Track Predictor</h1>
                <p className="text-neutral-600 mt-0.5 text-sm">Predict track success and explore dataset insights</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content - Using CSS to hide/show instead of conditional rendering for state preservation */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
          <div 
            className={`card p-6 sm:p-8 animate-fade-in ${activeTab === 'eda' ? 'block' : 'hidden'}`}
            data-testid="eda-content"
          >
            <EDATab />
          </div>
          
          <div 
            className={`card p-6 sm:p-8 animate-fade-in ${activeTab === 'prediction' ? 'block' : 'hidden'}`}
            data-testid="prediction-content"
          >
            <PredictionTab />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
