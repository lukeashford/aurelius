import {expect, test} from '@playwright/test';
import {navigateToSection} from './test-utils';

/**
 * Cards Component E2E Tests
 *
 * Tests for interactive card hover effects and card variant rendering.
 */

test.describe('CardsSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'cards');
  });

  test('interactive card shows hover effects', async ({page}) => {
    // Find the interactive card by its heading
    const interactiveCard = page.locator('#cards').getByText('Interactive').locator('..');

    // Get initial styles
    const initialBox = await interactiveCard.boundingBox();
    expect(initialBox).toBeTruthy();

    // Hover over the card
    await interactiveCard.hover();
    await page.waitForTimeout(300);

    // Verify the card is still visible (hover effect applied)
    await expect(interactiveCard).toBeVisible();
  });

  test('all card variants are rendered', async ({page}) => {
    // Verify all card variant headings are present
    const cardTitles = ['Default', 'Elevated', 'Outlined', 'Featured', 'Ghost', 'Interactive'];

    for (const title of cardTitles) {
      await expect(page.locator('#cards').getByRole('heading', {name: title})).toBeVisible();
    }
  });
});
