import {expect, test} from '@playwright/test';
import {navigateToSection} from './test-utils';

/**
 * Stepper Component E2E Tests
 *
 * Tests for navigation buttons (Previous/Next) and error state toggle.
 */

test.describe('StepperSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'stepper');
  });

  test('stepper navigation buttons work', async ({page}) => {
    const nextButton = page.locator('#stepper button:has-text("Next")');
    const prevButton = page.locator('#stepper button:has-text("Previous")');

    // Click Next button
    await nextButton.click();
    await page.waitForTimeout(200);

    // Previous button should now be enabled
    await expect(prevButton).toBeEnabled();

    // Click Previous button
    await prevButton.click();
    await prevButton.click();
    await page.waitForTimeout(200);

    // Should be back to initial state
    await expect(prevButton).toBeDisabled();
  });

  test('toggle error button works', async ({page}) => {
    const toggleErrorButton = page.locator('#stepper button:has-text("Toggle Error")');

    await expect(toggleErrorButton).toBeVisible();
    await toggleErrorButton.click();
    await page.waitForTimeout(200);

    // Click again to toggle off
    await toggleErrorButton.click();
    await page.waitForTimeout(200);
  });

  test('stepper advances through all steps', async ({page}) => {
    const nextButton = page.locator('#stepper button:has-text("Next")');

    // Click Next 3 times to reach the last step
    for (let i = 0; i < 2; i++) {
      await nextButton.click();
      await page.waitForTimeout(200);
    }

    // Next button should be disabled at the last step
    await expect(nextButton).toBeDisabled();
  });
});
