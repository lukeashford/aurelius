import {expect, test} from '@playwright/test';

/**
 * Responsive Behavior E2E Tests
 *
 * Tests for mobile, tablet, and desktop viewport behavior.
 */

test.describe('Responsive Behavior', () => {
  test('mobile viewport - sidebar is hidden', async ({page}) => {
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Sidebar should be hidden on mobile (has hidden class on small screens)
    const sidebar = page.locator('aside');
    // Check if it's either not visible or has the hidden class
    const isVisible = await sidebar.isVisible();
    // On mobile, sidebar has display:none via Tailwind classes
    expect(isVisible).toBe(false);
  });

  test('desktop viewport - sidebar is visible', async ({page}) => {
    await page.setViewportSize({width: 1920, height: 1080});
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
  });

  test('content is accessible on all viewports', async ({page}) => {
    const viewports = [
      {width: 375, height: 667},   // mobile
      {width: 768, height: 1024},  // tablet
      {width: 1920, height: 1080}, // desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify main heading is visible
      await expect(page.locator('#overview h1').first()).toBeVisible();
    }
  });
});
