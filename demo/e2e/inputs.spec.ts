import {expect, test} from '@playwright/test';
import {navigateToSection} from './test-utils';

/**
 * Inputs Component E2E Tests
 *
 * Tests for text input interactions, focus states, and disabled states.
 */

test.describe('InputsSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'inputs');
  });

  test('text input interactions', async ({page}) => {
    // Inputs don't have type="text" explicitly, so use generic input selector
    const textInput = page.locator('#inputs input').first();

    await textInput.fill('Test input');
    await expect(textInput).toHaveValue('Test input');
  });

  test('input focus states', async ({page}) => {
    const textInput = page.locator('#inputs input').first();

    await textInput.focus();

    // Just verify it's focused
    await expect(textInput).toBeFocused();
  });

  test('disabled input cannot be edited', async ({page}) => {
    const disabledInput = page.locator('#inputs input[disabled]').first();
    await expect(disabledInput).toBeDisabled();
  });
});
