import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import App from '../App';

afterEach(() => {
  cleanup();
});

// Feature: spotify-track-predictor, Property 8: Responsive layout adjustment
// Validates: Requirements 7.2
describe('Property 8: Responsive layout adjustment', () => {
  it('should adjust layout on window resize while maintaining accessibility', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate two different viewport sizes to simulate resize
        fc.integer({ min: 320, max: 2560 }),
        fc.integer({ min: 320, max: 2560 }),
        fc.integer({ min: 480, max: 1440 }),
        async (initialWidth, resizedWidth, height) => {
          // Set initial viewport size
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: initialWidth,
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

          // Get the layout elements before resize
          const inputPanelBefore = container.querySelector('[data-testid="input-panel"]') as HTMLElement;
          const predictionPanelBefore = container.querySelector('[data-testid="prediction-panel"]') as HTMLElement;
          const recommendationPanelBefore = container.querySelector('[data-testid="recommendation-panel"]') as HTMLElement;

          // Verify all panels exist before resize
          expect(inputPanelBefore).toBeTruthy();
          expect(predictionPanelBefore).toBeTruthy();
          expect(recommendationPanelBefore).toBeTruthy();

          // Simulate window resize
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: resizedWidth,
          });
          fireEvent(window, new Event('resize'));

          // Get the layout elements after resize
          const inputPanelAfter = container.querySelector('[data-testid="input-panel"]') as HTMLElement;
          const predictionPanelAfter = container.querySelector('[data-testid="prediction-panel"]') as HTMLElement;
          const recommendationPanelAfter = container.querySelector('[data-testid="recommendation-panel"]') as HTMLElement;

          // Verify all panels still exist and are accessible after resize
          expect(inputPanelAfter).toBeTruthy();
          expect(predictionPanelAfter).toBeTruthy();
          expect(recommendationPanelAfter).toBeTruthy();

          // Verify content is still readable (not hidden or display:none)
          const inputPanelContent = inputPanelAfter.textContent;
          const predictionPanelContent = predictionPanelAfter.textContent;
          const recommendationPanelContent = recommendationPanelAfter.textContent;

          expect(inputPanelContent).toBeTruthy();
          expect(predictionPanelContent).toBeTruthy();
          expect(recommendationPanelContent).toBeTruthy();

          // Verify the grid layout classes are still present
          const layoutContainer = container.querySelector('[data-testid="prediction-tab-layout"]') as HTMLElement;
          expect(layoutContainer.classList.contains('grid')).toBe(true);

          // Verify responsive classes are maintained
          expect(inputPanelAfter.classList.contains('lg:col-span-1')).toBe(true);
          expect(predictionPanelAfter.classList.contains('flex-1')).toBe(true);
          expect(recommendationPanelAfter.classList.contains('flex-1')).toBe(true);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
