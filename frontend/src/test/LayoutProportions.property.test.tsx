import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import App from '../App';

afterEach(() => {
  cleanup();
});

// Feature: spotify-track-predictor, Property 5: Layout proportions maintained
// Validates: Requirements 3.1, 4.1, 5.1, 7.3
describe('Property 5: Layout proportions maintained', () => {
  it('should maintain layout proportions for any viewport size above minimum', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate viewport widths from 1024px (lg breakpoint) to 2560px
        fc.integer({ min: 1024, max: 2560 }),
        fc.integer({ min: 768, max: 1440 }),
        async (width, height) => {
          // Set viewport size
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: width,
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: height,
          });

          const { container, unmount } = render(<App />);
          const user = userEvent.setup();

          // Navigate to prediction tab
          const predictionTab = container.querySelector('[data-testid="tab-prediction"]') as HTMLElement;
          await user.click(predictionTab);

          // Get the layout elements
          const inputPanel = container.querySelector('[data-testid="input-panel"]') as HTMLElement;
          const predictionPanel = container.querySelector('[data-testid="prediction-panel"]') as HTMLElement;
          const recommendationPanel = container.querySelector('[data-testid="recommendation-panel"]') as HTMLElement;

          // Verify all panels exist
          expect(inputPanel).toBeTruthy();
          expect(predictionPanel).toBeTruthy();
          expect(recommendationPanel).toBeTruthy();

          // Verify Input Panel has lg:col-span-1 (which is 1/2 of the grid)
          expect(inputPanel.classList.contains('lg:col-span-1')).toBe(true);

          // Verify Prediction and Recommendation panels are in a flex container with equal flex-1
          const rightContainer = predictionPanel.parentElement as HTMLElement;
          expect(rightContainer.classList.contains('flex')).toBe(true);
          expect(rightContainer.classList.contains('flex-col')).toBe(true);
          expect(rightContainer.classList.contains('lg:col-span-1')).toBe(true);

          // Verify both right panels have flex-1 (equal height distribution)
          expect(predictionPanel.classList.contains('flex-1')).toBe(true);
          expect(recommendationPanel.classList.contains('flex-1')).toBe(true);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
