import {expect, test} from '@playwright/test';
import {navigateToSection} from './test-utils';

/**
 * Buttons Component E2E Tests
 *
 * Tests for button clickability and disabled states.
 */

test.describe('ButtonsSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'buttons');
  });

  test('all button variants are clickable', async ({page}) => {
    const buttons = page.locator('#buttons button:not([disabled])');
    const count = await buttons.count();

    expect(count).toBeGreaterThan(0);

    // Click first few buttons to verify they're interactive
    const clickCount = Math.min(3, count);
    for (let i = 0; i < clickCount; i++) {
      const button = buttons.nth(i);
      await button.click();
    }
  });

  test('disabled buttons are not clickable', async ({page}) => {
    const disabledButtons = page.locator('#buttons button[disabled]');
    const count = await disabledButtons.count();

    if (count > 0) {
      const firstDisabled = disabledButtons.first();
      await expect(firstDisabled).toBeDisabled();
    }
  });
});
