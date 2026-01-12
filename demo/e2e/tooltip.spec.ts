import {expect, test} from '@playwright/test';
import {navigateToSection} from './test-utils';

/**
 * Tooltip Component E2E Tests
 *
 * Tests for click-to-toggle interactions and positioning.
 */

test.describe('TooltipSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'tooltip');
  });

  test('tooltips can be toggled by clicking buttons', async ({page}) => {
    const buttons = page.locator('#tooltip button');
    const topButton = buttons.filter({hasText: 'Hover top'});
    const tooltip = page.getByText('Tooltip on top');

    // Click to open tooltip
    await topButton.click();
    await page.waitForTimeout(200);

    // Verify tooltip appears with full opacity
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveCSS('opacity', '1');

    // Click again to close
    await topButton.click();
    await page.waitForTimeout(200);

    // Tooltip should be hidden with zero opacity
    await expect(tooltip).toHaveCSS('opacity', '0');
  });

  test('all tooltip positions work', async ({page}) => {
    const positions = ['top', 'right', 'bottom', 'left'];

    for (const position of positions) {
      const button = page.locator(`#tooltip button:has-text("Hover ${position}")`);
      const tooltip = page.getByText(`Tooltip on ${position}`);

      await expect(button).toBeVisible();

      // Click to open
      await button.click();
      await page.waitForTimeout(200);

      // Verify tooltip appears with full opacity
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toHaveCSS('opacity', '1');

      // Click to close
      await button.click();
      await page.waitForTimeout(200);

      // Verify tooltip is hidden with zero opacity
      await expect(tooltip).toHaveCSS('opacity', '0');
    }
  });
});
