import {expect, test} from '@playwright/test';

/**
 * Navigation Interactions E2E Tests
 *
 * Tests for URL hash navigation and section scrolling.
 */

test.describe('Navigation Interactions', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('clicking navigation updates URL hash', async ({page}) => {
    const colorsLink = page.locator('a[href="#colors"]');
    await colorsLink.click();
    await expect(page).toHaveURL(/#colors/);
    await expect(page.locator('#colors')).toBeVisible();
  });

  test('sections can be scrolled to', async ({page}) => {
    // Scroll to colors section
    await page.locator('#colors').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Verify the section is in viewport
    const colorsSection = page.locator('#colors');
    await expect(colorsSection).toBeInViewport();
  });
});
