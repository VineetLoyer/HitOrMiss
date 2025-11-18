import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import App from '../App';

describe('App - Initial Load', () => {
  it('should display both tabs on initial load', () => {
    render(<App />);
    
    // Verify both tab buttons are present
    const edaTab = screen.getByTestId('tab-eda');
    const predictionTab = screen.getByTestId('tab-prediction');
    
    expect(edaTab).toBeInTheDocument();
    expect(predictionTab).toBeInTheDocument();
    
    cleanup();
  });

  it('should have EDA tab as the default active tab', () => {
    render(<App />);
    
    // Verify EDA tab is active
    const edaTab = screen.getByTestId('tab-eda');
    expect(edaTab).toHaveClass('border-primary-600');
    expect(edaTab).toHaveClass('text-primary-700');
    expect(edaTab).toHaveAttribute('aria-current', 'page');
    
    // Verify EDA content is visible (has 'block' class, not 'hidden')
    const edaContent = screen.getByTestId('eda-content');
    expect(edaContent).toHaveClass('block');
    expect(edaContent).not.toHaveClass('hidden');
    
    // Verify Prediction content is hidden
    const predictionContent = screen.getByTestId('prediction-content');
    expect(predictionContent).toHaveClass('hidden');
    expect(predictionContent).not.toHaveClass('block');
    
    cleanup();
  });
});
