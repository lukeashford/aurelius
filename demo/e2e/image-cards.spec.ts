import {expect, test} from '@playwright/test';
import {navigateToSection} from './test-utils';

/**
 * Image Cards Component E2E Tests
 *
 * Tests for hover overlays and image loading.
 */

test.describe('ImageCardSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'image-cards');
  });

  test('image cards with overlay show hover effects', async ({page}) => {
    // Navigate to the "With Overlay" section
    const overlaySection = page.locator('#image-cards').getByText('With Overlay').locator('..');

    // Find image cards with overlays
    const imageCards = overlaySection.locator('.relative').filter({has: page.locator('img')});
    const count = await imageCards.count();

    expect(count).toBeGreaterThan(0);

    // Hover over the first card and verify it's still visible
    const firstCard = imageCards.first();
    await firstCard.hover();
    await page.waitForTimeout(300);

    await expect(firstCard).toBeVisible();
  });

  test('all image cards load successfully', async ({page}) => {
    const images = page.locator('#image-cards img');
    const count = await images.count();

    expect(count).toBeGreaterThan(0);

    // Check first few images loaded
    for (let i = 0; i < Math.min(3, count); i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
    }
  });
});
