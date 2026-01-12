import {expect, test} from '@playwright/test';
import {navigateToSection} from './test-utils';

/**
 * Navigation Components E2E Tests
 *
 * Tests for Tabs, Accordion, Menu, Pagination, and Breadcrumb components.
 */

test.describe('NavigationSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'navigation');
  });

  test.describe('Tabs', () => {
    test('switches tab content on click', async ({page}) => {
      // Click on Notifications tab
      const notificationsTab = page.locator('#navigation button:has-text("Notifications")');
      await notificationsTab.click();
      await page.waitForTimeout(200);

      // Verify notifications content is visible
      await expect(page.locator('text=Configure how you receive notifications')).toBeVisible();

      // Click on Security tab
      const securityTab = page.locator('#navigation button:has-text("Security")');
      await securityTab.click();
      await page.waitForTimeout(200);

      // Verify security content is visible
      await expect(page.locator('text=Update your security settings')).toBeVisible();
    });

    test('disabled tab cannot be clicked', async ({page}) => {
      const disabledTab = page.locator('#navigation button:has-text("Disabled")');
      await expect(disabledTab).toBeDisabled();
    });

    test('active tab has aria-selected', async ({page}) => {
      const accountTab = page.locator('#navigation button:has-text("Account")');
      await expect(accountTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  test.describe('Accordion', () => {
    test('expands and collapses accordion items', async ({page}) => {
      // Click on second accordion item
      const secondTrigger = page.locator('#navigation button:has-text("How do I get started?")');
      await secondTrigger.click();
      await page.waitForTimeout(200);

      // Verify second item content is visible
      await expect(page.locator('text=Install the package via npm')).toBeVisible();

      // First item should now be hidden (single mode)
      const firstContent = page.locator('text=Aurelius is a cohesive design system');
      expect(await firstContent.isVisible()).toBe(false);
    });

    test('accordion trigger has aria-expanded', async ({page}) => {
      const firstTrigger = page.locator('#navigation button:has-text("What is Aurelius?")');
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test.describe('Menu', () => {
    test('opens and closes menu', async ({page}) => {
      // Click to open menu
      const menuTrigger = page.locator('#navigation button:has-text("Options")');
      await menuTrigger.click();
      await page.waitForTimeout(200);

      const menu = page.locator('#navigation [role="menu"]');
      await expect(menu).toBeVisible();

      // Verify menu content is visible
      await expect(menu.getByText('My Account')).toBeVisible();
      await expect(menu.getByRole('menuitem', {name: 'Profile'})).toBeVisible();

      // Click trigger again to close
      await menuTrigger.click();
      await page.waitForTimeout(200);

      // Menu should be closed
      await expect(menu).not.toBeVisible();
    });

    test('menu items are clickable', async ({page}) => {
      const menuTrigger = page.locator('#navigation button:has-text("Options")');
      await menuTrigger.click();
      await page.waitForTimeout(200);

      // Click on Settings menu item
      const settingsItem = page.locator('[role="menuitem"]:has-text("Settings")');
      await expect(settingsItem).toBeVisible();
      await settingsItem.click();

      // Menu should close after clicking an item
      await expect(page.locator('text=My Account')).not.toBeVisible();
    });
  });

  test.describe('Pagination', () => {
    test('clicking page number updates current page', async ({page}) => {
      // Click page 3
      const page3Button = page.locator('#navigation button:has-text("3")');
      await page3Button.click();
      await page.waitForTimeout(200);

      // Verify page indicator updates
      await expect(page.locator('text=Current page: 3')).toBeVisible();
    });

    test('next button advances page', async ({page}) => {
      // Find and click next button (last button in pagination nav)
      const nextButton = page.locator('#navigation nav[role="navigation"] button').last();
      await nextButton.click();
      await page.waitForTimeout(200);

      // Page should have advanced
      await expect(page.locator('text=Current page: 2')).toBeVisible();
    });

    test('previous button is disabled on first page', async ({page}) => {
      // Previous button is first in pagination nav
      const prevButton = page.locator('#navigation nav[role="navigation"] button').first();
      await expect(prevButton).toBeDisabled();
    });

    test('current page has aria-current', async ({page}) => {
      const page1Button = page.locator(
          '#navigation nav[role="navigation"] button[aria-current="page"]');
      await expect(page1Button).toBeVisible();
      await expect(page1Button).toHaveText('1');
    });
  });

  test.describe('Breadcrumb', () => {
    test('renders breadcrumb trail', async ({page}) => {
      // Verify all breadcrumb items are visible
      await expect(page.locator('#navigation a:has-text("Home")').first()).toBeVisible();
      await expect(page.locator('#navigation a:has-text("Products")')).toBeVisible();
      await expect(page.locator('#navigation a:has-text("Category")')).toBeVisible();
      await expect(page.locator('#navigation span:has-text("Current Page")')).toBeVisible();
    });

    test('current page has aria-current', async ({page}) => {
      const currentItem = page.locator('#navigation span[aria-current="page"]');
      await expect(currentItem).toHaveText('Current Page');
    });
  });
});
