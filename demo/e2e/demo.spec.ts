import {expect, test} from '@playwright/test';

test.describe('Aurelius Design Demo', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('has correct title and heading', async ({page}) => {
    await expect(page).toHaveTitle(/Aurelius/);
    // Use specific selector for the main heading in the overview section
    await expect(page.locator('#overview h1').first()).toHaveText('Aurelius Design');
  });

  test('renders sidebar navigation', async ({page}) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check all navigation items
    const navItems = [
      'Overview',
      "Director's Note",
      'Colors',
      'Typography',
      'Layout',
      'Buttons',
      'Badges',
      'Inputs',
      'Cards',
      'Forms',
      'Navigation',
      'Data Display',
      'Stepper',
      'Tooltip',
      'Overlays',
      'Avatar',
      'Brand Icons',
      'Markdown Content',
      'Image Cards',
      'Feedback',
      'Streaming Cursor',
      'Messages',
    ];

    for (const item of navItems) {
      await expect(page.getByRole('link', {name: item, exact: true})).toBeVisible();
    }
  });

  test('GitHub link opens in new tab', async ({page}) => {
    const githubLink = page.locator('a:has-text("View Source on GitHub")');
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/lukeashford/aurelius');
  });

  test('legal notice navigation works', async ({page}) => {
    await page.goto('/#legal');
    await page.waitForLoadState('networkidle');

    // Check for the actual heading that exists (Impressum / Legal Notice)
    await expect(page.getByRole('heading', {name: /Impressum.*Legal Notice/i})).toBeVisible();
  });

  test('all sections are present', async ({page}) => {
    const sectionIds = [
      'overview',
      'director-note',
      'colors',
      'typography',
      'layout',
      'buttons',
      'badges',
      'inputs',
      'cards',
      'forms',
      'navigation',
      'data-display',
      'stepper',
      'tooltip',
      'modal',
      'avatar',
      'brand-icons',
      'markdown',
      'image-cards',
      'feedback',
      'streaming',
      'messages',
    ];

    for (const id of sectionIds) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('navigation links update URL hash', async ({page}) => {
    const colorsLink = page.locator('nav a[href="#colors"]');
    await colorsLink.click();
    await page.waitForTimeout(300);
    expect(page.url()).toContain('#colors');
  });
});
