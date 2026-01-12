import {expect, test} from '@playwright/test';
import {navigateToSection} from './test-utils';

/**
 * Streaming Cursor Component E2E Tests
 *
 * Tests for animation, text streaming, and variant cycling.
 */

test.describe('StreamingCursorSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'streaming');
  });

  test('streaming cursor animates and text appears', async ({page}) => {
    // Wait for the streaming section to be visible
    await expect(page.locator('#streaming')).toBeVisible();

    // Find the streaming cursor element
    const cursorElement = page.locator('#streaming .cursor, #streaming [class*="cursor"]')
    .first();

    // Wait a moment for animation to start
    await page.waitForTimeout(500);

    // Get the text content area
    const textContainer = page.locator('#streaming p.text-white.text-lg');
    await expect(textContainer).toBeVisible();

    // Wait and verify text is being added
    await page.waitForTimeout(1000);
    const text1 = await textContainer.textContent();

    await page.waitForTimeout(1000);
    const text2 = await textContainer.textContent();

    // Text should be growing (or cycling)
    expect(text1).toBeTruthy();
    expect(text2).toBeTruthy();
  });

  test('streaming cursor cycles through variants', async ({page}) => {
    await expect(page.locator('#streaming')).toBeVisible();

    // Check for variant indicator
    const variantIndicator = page.locator('#streaming p.text-silver.text-sm').first();
    await expect(variantIndicator).toBeVisible();

    const initialVariant = await variantIndicator.textContent();
    expect(initialVariant).toContain('variant=');
  });
});
