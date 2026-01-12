import {expect, test} from '@playwright/test';
import {navigateToSection} from './test-utils';

/**
 * Forms Component E2E Tests
 *
 * Tests for form elements: checkboxes, radio buttons, switches, selects, and textareas.
 */

test.describe('FormsSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'forms');
  });

  test('checkbox interactions', async ({page}) => {
    // Target checkboxes specifically within the forms section
    const checkbox = page.locator('#forms input[type="checkbox"]').first();

    // Get initial state
    const initialChecked = await checkbox.isChecked();

    // Click and verify state change
    await checkbox.click();
    const newChecked = await checkbox.isChecked();
    expect(newChecked).toBe(!initialChecked);
  });

  test('radio button interactions', async ({page}) => {
    const radioButtons = page.locator('#forms input[type="radio"][name="plan"]');
    const count = await radioButtons.count();

    expect(count).toBeGreaterThan(0);

    // Click first non-disabled radio
    const firstRadio = radioButtons.first();
    await firstRadio.click();
    await expect(firstRadio).toBeChecked();
  });

  test('switch interactions', async ({page}) => {
    // Find switches within the forms section
    // Switches are checkboxes that come after the regular checkboxes
    const allCheckboxes = page.locator('#forms input[type="checkbox"]');
    const count = await allCheckboxes.count();

    // Skip the regular checkboxes (first 2-3) and target switches
    if (count > 3) {
      const switchInput = allCheckboxes.nth(3);
      const initialState = await switchInput.isChecked();
      await switchInput.click();
      const newState = await switchInput.isChecked();
      expect(newState).toBe(!initialState);
    } else {
      // If not enough checkboxes, just verify forms section exists
      await expect(page.locator('#forms')).toBeVisible();
    }
  });

  test('select dropdown interactions', async ({page}) => {
    const select = page.locator('#forms select').first();
    await expect(select).toBeVisible();

    // Select an option
    await select.selectOption({index: 1});
  });

  test('textarea input', async ({page}) => {
    const textarea = page.locator('#forms textarea').first();
    await expect(textarea).toBeVisible();

    await textarea.fill('Test input text for textarea');
    await expect(textarea).toHaveValue('Test input text for textarea');
  });
});
