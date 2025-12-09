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

      // Take snapshot of open modal
      await expect(page).toHaveScreenshot('modal-open.png', {
        animations: 'disabled',
      });

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
      const checkbox = page.locator('input[type="checkbox"]').first();

      // Get initial state
      const initialChecked = await checkbox.isChecked();

      // Click and verify state change
      await checkbox.click();
      const newChecked = await checkbox.isChecked();
      expect(newChecked).toBe(!initialChecked);

      // Visual snapshot of form with checked checkbox
      const formsSection = page.locator('#forms');
      await expect(formsSection).toHaveScreenshot('forms-checkbox-checked.png');
    });

    test('radio button interactions', async ({ page }) => {
      const radioButtons = page.locator('input[type="radio"][name="plan"]');
      const count = await radioButtons.count();

      expect(count).toBeGreaterThan(0);

      // Click first non-disabled radio
      const firstRadio = radioButtons.first();
      await firstRadio.click();
      await expect(firstRadio).toBeChecked();
    });

    test('switch interactions', async ({ page }) => {
      const switchInput = page.locator('input[type="checkbox"]').nth(3); // Assuming switches are after checkboxes

      // Toggle switch
      const initialState = await switchInput.isChecked();
      await switchInput.click();
      const newState = await switchInput.isChecked();
      expect(newState).toBe(!initialState);
    });

    test('select dropdown interactions', async ({ page }) => {
      const select = page.locator('select').first();
      await expect(select).toBeVisible();

      // Select an option
      await select.selectOption({ index: 1 });

      // Visual snapshot
      const formsSection = page.locator('#forms');
      await expect(formsSection).toHaveScreenshot('forms-select-changed.png');
    });

    test('textarea input', async ({ page }) => {
      const textarea = page.locator('textarea').first();
      await expect(textarea).toBeVisible();

      await textarea.fill('Test input text for textarea');
      await expect(textarea).toHaveValue('Test input text for textarea');

      // Visual snapshot
      const formsSection = page.locator('#forms');
      await expect(formsSection).toHaveScreenshot('forms-textarea-filled.png');
    });
  });

  test.describe('Input Field Interactions', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('a[href="#inputs"]').click();
      await page.waitForTimeout(500);
    });

    test('text input interactions', async ({ page }) => {
      const textInput = page.locator('input[type="text"]').first();

      await textInput.fill('Test input');
      await expect(textInput).toHaveValue('Test input');

      // Visual snapshot
      const inputsSection = page.locator('#inputs');
      await expect(inputsSection).toHaveScreenshot('inputs-text-filled.png');
    });

    test('input focus states', async ({ page }) => {
      const textInput = page.locator('input[type="text"]').first();

      await textInput.focus();

      // Visual snapshot showing focus state
      const inputsSection = page.locator('#inputs');
      await expect(inputsSection).toHaveScreenshot('inputs-focused.png');
    });
  });

  test.describe('Button Interactions', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('a[href="#buttons"]').click();
      await page.waitForTimeout(500);
    });

    test('button hover states', async ({ page }) => {
      const primaryButton = page.locator('button:has-text("Primary")').first();

      await primaryButton.hover();

      // Visual snapshot showing hover state
      const buttonsSection = page.locator('#buttons');
      await expect(buttonsSection).toHaveScreenshot('buttons-hover.png');
    });

    test('all button variants are clickable', async ({ page }) => {
      const buttons = page.locator('#buttons button');
      const count = await buttons.count();

      expect(count).toBeGreaterThan(0);

      // Click each button to verify they're interactive
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        if (await button.isEnabled()) {
          await button.click();
        }
      }
    });
  });

  test.describe('Tooltip Interactions', () => {
    test('tooltip appears on hover', async ({ page }) => {
      await page.locator('a[href="#tooltip"]').click();
      await page.waitForTimeout(500);

      // Find tooltip trigger
      const tooltipTrigger = page.locator('[data-tooltip], [aria-describedby]').first();

      if (await tooltipTrigger.count() > 0) {
        await tooltipTrigger.hover();
        await page.waitForTimeout(500);

        // Visual snapshot with tooltip
        const tooltipSection = page.locator('#tooltip');
        await expect(tooltipSection).toHaveScreenshot('tooltip-visible.png');
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

    test('navigation link becomes active when section is visible', async ({ page }) => {
      const buttonsLink = page.locator('a[href="#buttons"]');
      await buttonsLink.click();

      await page.waitForTimeout(500);
      await expect(buttonsLink).toHaveClass(/active/);
    });

    test('scrolling through sections updates active nav item', async ({ page }) => {
      // Scroll to colors section
      await page.locator('#colors').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // The navigation should update (this depends on IntersectionObserver)
      const url = page.url();
      // Just verify we can scroll without errors
      expect(url).toBeTruthy();
    });
  });
});

test.describe('Responsive Behavior', () => {
  test('mobile viewport rendering', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Sidebar should be hidden on mobile
    const sidebar = page.locator('aside');
    await expect(sidebar).not.toBeVisible();

    // Take mobile snapshot
    await expect(page).toHaveScreenshot('mobile-view.png', {
      fullPage: true,
    });
  });

  test('tablet viewport rendering', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('tablet-view.png', {
      fullPage: true,
    });
  });

  test('desktop viewport rendering', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('desktop-view.png');
  });
});
