import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import App from '../App';

afterEach(() => {
  cleanup();
});

// Feature: spotify-track-predictor, Property 1: Tab switching displays correct content
// Validates: Requirements 1.2, 1.3
describe('Property 1: Tab switching displays correct content', () => {
  it('should display correct content for any tab selection', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('eda', 'prediction'),
        async (tabName) => {
          const { container, unmount } = render(<App />);
          const user = userEvent.setup();

          // Click on the selected tab
          const tabButton = container.querySelector(`[data-testid="tab-${tabName}"]`) as HTMLElement;
          await user.click(tabButton);

          // Verify the correct content has 'block' class and not 'hidden'
          const expectedContent = container.querySelector(`[data-testid="${tabName}-content"]`) as HTMLElement;
          expect(expectedContent.classList.contains('block')).toBe(true);
          expect(expectedContent.classList.contains('hidden')).toBe(false);

          // Verify the other tab's content has 'hidden' class
          const otherTab = tabName === 'eda' ? 'prediction' : 'eda';
          const otherContent = container.querySelector(`[data-testid="${otherTab}-content"]`) as HTMLElement;
          expect(otherContent.classList.contains('hidden')).toBe(true);
          expect(otherContent.classList.contains('block')).toBe(false);

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});

// Feature: spotify-track-predictor, Property 3: Active tab visual indication
// Validates: Requirements 1.5
describe('Property 3: Active tab visual indication', () => {
  it('should apply visual indicator to active tab for any tab selection', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('eda', 'prediction'),
        async (tabName) => {
          const { container, unmount } = render(<App />);
          const user = userEvent.setup();

          // Click on the selected tab
          const tabButton = container.querySelector(`[data-testid="tab-${tabName}"]`) as HTMLElement;
          await user.click(tabButton);

          // Verify the active tab has the visual indicator (primary border and text)
          expect(tabButton.classList.contains('border-primary-600')).toBe(true);
          expect(tabButton.classList.contains('text-primary-700')).toBe(true);
          expect(tabButton.getAttribute('aria-current')).toBe('page');

          // Verify the inactive tab does not have the visual indicator
          const otherTab = tabName === 'eda' ? 'prediction' : 'eda';
          const otherButton = container.querySelector(`[data-testid="tab-${otherTab}"]`) as HTMLElement;
          expect(otherButton.classList.contains('border-transparent')).toBe(true);
          expect(otherButton.getAttribute('aria-current')).toBeNull();

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});
