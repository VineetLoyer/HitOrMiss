import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import App from '../App';

afterEach(() => {
  cleanup();
});

// Feature: spotify-track-predictor, Property 2: Tab state preservation
// Validates: Requirements 1.4
describe('Property 2: Tab state preservation', () => {
  it('should preserve DOM elements when switching tabs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.constantFrom('eda', 'prediction'), { minLength: 2, maxLength: 5 }),
        async (tabSequence) => {
          const { container, unmount } = render(<App />);
          const user = userEvent.setup();

          // Get initial content references
          const edaContent = container.querySelector('[data-testid="eda-content"]') as HTMLElement;
          const predictionContent = container.querySelector('[data-testid="prediction-content"]') as HTMLElement;
          
          // Store initial text content
          const initialEdaText = edaContent.textContent;
          const initialPredictionText = predictionContent.textContent;

          // Click through the sequence of tabs
          for (const tabName of tabSequence) {
            const tabButton = container.querySelector(`[data-testid="tab-${tabName}"]`) as HTMLElement;
            await user.click(tabButton);
          }

          // Verify that the content elements still exist and have the same content
          const finalEdaContent = container.querySelector('[data-testid="eda-content"]') as HTMLElement;
          const finalPredictionContent = container.querySelector('[data-testid="prediction-content"]') as HTMLElement;
          
          expect(finalEdaContent.textContent).toBe(initialEdaText);
          expect(finalPredictionContent.textContent).toBe(initialPredictionText);
          
          // Verify the DOM elements are the same instances (not recreated)
          expect(finalEdaContent).toBe(edaContent);
          expect(finalPredictionContent).toBe(predictionContent);

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});
