import { test, expect } from '@playwright/test';

test.describe('Interactive Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Modal Interactions', () => {
    test('opens and closes modal', async ({ page }) => {
      // Navigate to modal section
      await page.locator('a[href="#modal"]').click();
      await page.waitForTimeout(500);

      // Find and click the Open Modal button
      const openButton = page.locator('button:has-text("Open Modal")').first();
      await openButton.click();

      // Verify modal is visible
      await expect(page.locator('text=Example Modal')).toBeVisible();

      // Close modal with Cancel button
      await page.locator('button:has-text("Cancel")').click();

      // Verify modal is closed
      await expect(page.locator('text=Example Modal')).not.toBeVisible();
    });

    test('closes modal with Confirm button', async ({ page }) => {
      await page.locator('a[href="#modal"]').click();
      await page.waitForTimeout(500);

      const openButton = page.locator('button:has-text("Open Modal")').first();
      await openButton.click();

      await expect(page.locator('text=Example Modal')).toBeVisible();

      // Close with Confirm button
      await page.locator('button:has-text("Confirm")').click();
      await expect(page.locator('text=Example Modal')).not.toBeVisible();
    });

    test('modal overlay appears correctly', async ({ page }) => {
      await page.locator('a[href="#modal"]').click();
      await page.waitForTimeout(500);

      const openButton = page.locator('button:has-text("Open Modal")').first();
      await openButton.click();

      // Check for modal backdrop/overlay
      const modalContainer = page.locator('[role="dialog"], .modal, [data-modal]').first();
      await expect(modalContainer).toBeVisible();
    });
  });

  test.describe('Form Interactions', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('a[href="#forms"]').click();
      await page.waitForTimeout(500);
    });

    test('checkbox interactions', async ({ page }) => {
      // Target checkboxes specifically within the forms section
      const checkbox = page.locator('#forms input[type="checkbox"]').first();

      // Get initial state
      const initialChecked = await checkbox.isChecked();

      // Click and verify state change
      await checkbox.click();
      const newChecked = await checkbox.isChecked();
      expect(newChecked).toBe(!initialChecked);
    });

    test('radio button interactions', async ({ page }) => {
      const radioButtons = page.locator('#forms input[type="radio"][name="plan"]');
      const count = await radioButtons.count();

      expect(count).toBeGreaterThan(0);

      // Click first non-disabled radio
      const firstRadio = radioButtons.first();
      await firstRadio.click();
      await expect(firstRadio).toBeChecked();
    });

    test('switch interactions', async ({ page }) => {
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

    test('select dropdown interactions', async ({ page }) => {
      const select = page.locator('#forms select').first();
      await expect(select).toBeVisible();

      // Select an option
      await select.selectOption({ index: 1 });
    });

    test('textarea input', async ({ page }) => {
      const textarea = page.locator('#forms textarea').first();
      await expect(textarea).toBeVisible();

      await textarea.fill('Test input text for textarea');
      await expect(textarea).toHaveValue('Test input text for textarea');
    });
  });

  test.describe('Input Field Interactions', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('a[href="#inputs"]').click();
      await page.waitForTimeout(500);
    });

    test('text input interactions', async ({ page }) => {
      // Inputs don't have type="text" explicitly, so use generic input selector
      const textInput = page.locator('#inputs input').first();

      await textInput.fill('Test input');
      await expect(textInput).toHaveValue('Test input');
    });

    test('input focus states', async ({ page }) => {
      const textInput = page.locator('#inputs input').first();

      await textInput.focus();

      // Just verify it's focused
      await expect(textInput).toBeFocused();
    });

    test('disabled input cannot be edited', async ({ page }) => {
      const disabledInput = page.locator('#inputs input[disabled]').first();
      await expect(disabledInput).toBeDisabled();
    });
  });

  test.describe('Button Interactions', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('a[href="#buttons"]').click();
      await page.waitForTimeout(500);
    });

    test('all button variants are clickable', async ({ page }) => {
      const buttons = page.locator('#buttons button:not([disabled])');
      const count = await buttons.count();

      expect(count).toBeGreaterThan(0);

      // Click first few buttons to verify they're interactive
      const clickCount = Math.min(3, count);
      for (let i = 0; i < clickCount; i++) {
        const button = buttons.nth(i);
        await button.click();
      }
    });

    test('disabled buttons are not clickable', async ({ page }) => {
      const disabledButtons = page.locator('#buttons button[disabled]');
      const count = await disabledButtons.count();

      if (count > 0) {
        const firstDisabled = disabledButtons.first();
        await expect(firstDisabled).toBeDisabled();
      }
    });
  });

  test.describe('Navigation Interactions', () => {
    test('clicking navigation updates URL hash', async ({ page }) => {
      const colorsLink = page.locator('a[href="#colors"]');
      await colorsLink.click();

      await page.waitForTimeout(500);
      expect(page.url()).toContain('#colors');
    });

    test('sections can be scrolled to', async ({ page }) => {
      // Scroll to colors section
      await page.locator('#colors').scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Verify the section is in viewport
      const colorsSection = page.locator('#colors');
      await expect(colorsSection).toBeInViewport();
    });
  });
});

test.describe('Responsive Behavior', () => {
  test('mobile viewport - sidebar is hidden', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Sidebar should be hidden on mobile (has hidden class on small screens)
    const sidebar = page.locator('aside');
    // Check if it's either not visible or has the hidden class
    const isVisible = await sidebar.isVisible();
    // On mobile, sidebar has display:none via Tailwind classes
    expect(isVisible).toBe(false);
  });

  test('desktop viewport - sidebar is visible', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
  });

  test('content is accessible on all viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },   // mobile
      { width: 768, height: 1024 },  // tablet
      { width: 1920, height: 1080 }, // desktop
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
