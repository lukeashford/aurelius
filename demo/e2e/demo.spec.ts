import { test, expect } from '@playwright/test';

test.describe('Aurelius Design Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('has correct title and heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Aurelius/);
    await expect(page.locator('h1')).toHaveText('Aurelius Design');
  });

  test('renders sidebar navigation', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check all navigation items
    const navItems = [
      'Overview',
      "Director's Note",
      'Colors',
      'Typography',
      'Buttons',
      'Badges',
      'Inputs',
      'Forms',
      'Cards',
      'Avatar',
      'Feedback',
      'Tooltip',
      'Overlays',
    ];

    for (const item of navItems) {
      await expect(page.locator('nav a', { hasText: item })).toBeVisible();
    }
  });

  test('full page visual snapshot', async ({ page }) => {
    // Take a full page screenshot for comparison
    await expect(page).toHaveScreenshot('full-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('viewport visual snapshot', async ({ page }) => {
    // Initial viewport screenshot
    await expect(page).toHaveScreenshot('viewport-initial.png', {
      animations: 'disabled',
    });
  });

  test('navigation link has active state', async ({ page }) => {
    const overviewLink = page.locator('nav a[href="#overview"]');
    await expect(overviewLink).toHaveClass(/active/);
  });

  test('GitHub link opens in new tab', async ({ page }) => {
    const githubLink = page.locator('a:has-text("View Source on GitHub")');
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/lukeashford/aurelius');
  });

  test('legal notice link navigation', async ({ page, context }) => {
    await page.goto('/#legal');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2')).toContainText('Legal Information');
  });
});

test.describe('Section Visual Snapshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('overview section snapshot', async ({ page }) => {
    const section = page.locator('#overview');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-overview.png');
  });

  test('colors section snapshot', async ({ page }) => {
    await page.locator('a[href="#colors"]').click();
    const section = page.locator('#colors');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300); // Wait for scroll animation
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-colors.png');
  });

  test('typography section snapshot', async ({ page }) => {
    await page.locator('a[href="#typography"]').click();
    const section = page.locator('#typography');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-typography.png');
  });

  test('buttons section snapshot', async ({ page }) => {
    await page.locator('a[href="#buttons"]').click();
    const section = page.locator('#buttons');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-buttons.png');
  });

  test('badges section snapshot', async ({ page }) => {
    await page.locator('a[href="#badges"]').click();
    const section = page.locator('#badges');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-badges.png');
  });

  test('inputs section snapshot', async ({ page }) => {
    await page.locator('a[href="#inputs"]').click();
    const section = page.locator('#inputs');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-inputs.png');
  });

  test('forms section snapshot', async ({ page }) => {
    await page.locator('a[href="#forms"]').click();
    const section = page.locator('#forms');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-forms.png');
  });

  test('cards section snapshot', async ({ page }) => {
    await page.locator('a[href="#cards"]').click();
    const section = page.locator('#cards');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-cards.png');
  });

  test('avatar section snapshot', async ({ page }) => {
    await page.locator('a[href="#avatar"]').click();
    const section = page.locator('#avatar');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-avatar.png');
  });

  test('feedback section snapshot', async ({ page }) => {
    await page.locator('a[href="#feedback"]').click();
    const section = page.locator('#feedback');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-feedback.png');
  });

  test('tooltip section snapshot', async ({ page }) => {
    await page.locator('a[href="#tooltip"]').click();
    const section = page.locator('#tooltip');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-tooltip.png');
  });

  test('modal section snapshot', async ({ page }) => {
    await page.locator('a[href="#modal"]').click();
    const section = page.locator('#modal');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-modal.png');
  });
});
