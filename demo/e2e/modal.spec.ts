import {expect, test} from '@playwright/test';
import {navigateToSection} from './test-utils';

/**
 * Modal Component E2E Tests
 *
 * Tests for modal open/close interactions and overlay visibility.
 */

test.describe('ModalSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'modal');
  });

  test('opens and closes modal', async ({page}) => {
    // Find and click the Open Modal button (exact label in demo is "Open Centered Modal")
    const openButton = page.getByRole('button', {name: 'Open Modal'}).first();
    await openButton.click();

    // Verify modal is visible
    await expect(page.locator('text=Example Modal')).toBeVisible();

    // Close modal with Cancel button
    await page.getByRole('dialog').getByRole('button', {name: 'Cancel'}).click();

    // Verify modal is closed
    await expect(page.locator('text=Example Modal')).not.toBeVisible();
  });

  test('closes modal with Confirm button', async ({page}) => {
    const openButton = page.getByRole('button', {name: 'Open Modal'}).first();
    await openButton.click();

    await expect(page.locator('text=Example Modal')).toBeVisible();

    // Close with Confirm button
    await page.getByRole('dialog').getByRole('button', {name: 'Confirm'}).click();
    await expect(page.locator('text=Example Modal')).not.toBeVisible();
  });

  test('modal overlay appears correctly', async ({page}) => {
    const openButton = page.getByRole('button', {name: 'Open Modal'}).first();
    await openButton.click();

    // Check for modal backdrop/overlay
    const modalContainer = page.locator('[role="dialog"], .modal, [data-modal]').first();
    await expect(modalContainer).toBeVisible();
  });
});
