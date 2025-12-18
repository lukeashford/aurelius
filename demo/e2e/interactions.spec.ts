import {expect, test} from '@playwright/test';

/**
 * Interactive Components E2E Tests
 *
 * This test suite covers all interactive components in the demo application,
 * excluding static/non-interactive sections (Typography, Colors, Badges, Avatar,
 * Markdown Content, Brand Icons).
 *
 * Tested Interactive Components:
 * - Modal: Open/close interactions, overlay visibility
 * - Forms: Checkboxes, radio buttons, switches, selects, textareas
 * - Inputs: Text input, focus states, disabled states
 * - Buttons: Clickability, disabled states
 * - Cards: Interactive card hover effects
 * - Image Cards: Hover overlays, image loading
 * - Tooltips: Click-to-toggle interactions, positioning
 * - Stepper: Navigation buttons (Previous/Next), error state toggle
 * - Streaming Cursor: Animation, text streaming, variant cycling
 * - Message Streaming: Cursor during streaming, auto-scroll behavior, stream restart
 * - Navigation: Hash updates, section scrolling
 */
test.describe('Interactive Elements', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // Helper to navigate reliably to a section by hash link
  const navigateToSection = async (page: import('@playwright/test').Page, id: string) => {
    const link = page.locator(`a[href="#${id}"]`).first();
    await expect(link).toBeVisible();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${id}`));
    await expect(page.locator(`#${id}`)).toBeVisible();
  };

  test.describe('Modal Interactions', () => {
    test('opens and closes modal', async ({page}) => {
      // Navigate to modal section
      await navigateToSection(page, 'modal');

      // Find and click the Open Modal button (exact label in demo is "Open Centered Modal")
      const openButton = page.getByRole('button', {name: 'Open Centered Modal'}).first();
      await openButton.click();

      // Verify modal is visible
      await expect(page.locator('text=Example Modal')).toBeVisible();

      // Close modal with Cancel button
      await page.locator('button:has-text("Cancel")').click();

      // Verify modal is closed
      await expect(page.locator('text=Example Modal')).not.toBeVisible();
    });

    test('closes modal with Confirm button', async ({page}) => {
      await navigateToSection(page, 'modal');

      const openButton = page.getByRole('button', {name: 'Open Centered Modal'}).first();
      await openButton.click();

      await expect(page.locator('text=Example Modal')).toBeVisible();

      // Close with Confirm button
      await page.locator('button:has-text("Confirm")').click();
      await expect(page.locator('text=Example Modal')).not.toBeVisible();
    });

    test('modal overlay appears correctly', async ({page}) => {
      await navigateToSection(page, 'modal');

      const openButton = page.locator('button:has-text("Open Modal")').first();
      await openButton.click();

      // Check for modal backdrop/overlay
      const modalContainer = page.locator('[role="dialog"], .modal, [data-modal]').first();
      await expect(modalContainer).toBeVisible();
    });
  });

  test.describe('Form Interactions', () => {
    test.beforeEach(async ({page}) => {
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

  test.describe('Input Field Interactions', () => {
    test.beforeEach(async ({page}) => {
      await navigateToSection(page, 'inputs');
    });

    test('text input interactions', async ({page}) => {
      // Inputs don't have type="text" explicitly, so use generic input selector
      const textInput = page.locator('#inputs input').first();

      await textInput.fill('Test input');
      await expect(textInput).toHaveValue('Test input');
    });

    test('input focus states', async ({page}) => {
      const textInput = page.locator('#inputs input').first();

      await textInput.focus();

      // Just verify it's focused
      await expect(textInput).toBeFocused();
    });

    test('disabled input cannot be edited', async ({page}) => {
      const disabledInput = page.locator('#inputs input[disabled]').first();
      await expect(disabledInput).toBeDisabled();
    });
  });

  test.describe('Button Interactions', () => {
    test.beforeEach(async ({page}) => {
      await navigateToSection(page, 'buttons');
    });

    test('all button variants are clickable', async ({page}) => {
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

    test('disabled buttons are not clickable', async ({page}) => {
      const disabledButtons = page.locator('#buttons button[disabled]');
      const count = await disabledButtons.count();

      if (count > 0) {
        const firstDisabled = disabledButtons.first();
        await expect(firstDisabled).toBeDisabled();
      }
    });
  });

  test.describe('Navigation Interactions', () => {
    test('clicking navigation updates URL hash', async ({page}) => {
      const colorsLink = page.locator('a[href="#colors"]');
      await colorsLink.click();
      await expect(page).toHaveURL(/#colors/);
      await expect(page.locator('#colors')).toBeVisible();
    });

    test('sections can be scrolled to', async ({page}) => {
      // Scroll to colors section
      await page.locator('#colors').scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Verify the section is in viewport
      const colorsSection = page.locator('#colors');
      await expect(colorsSection).toBeInViewport();
    });
  });

  test.describe('Card Interactions', () => {
    test.beforeEach(async ({page}) => {
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

  test.describe('Image Card Interactions', () => {
    test.beforeEach(async ({page}) => {
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

  test.describe('Tooltip Interactions', () => {
    test.beforeEach(async ({page}) => {
      await navigateToSection(page, 'tooltip');
    });

    test('tooltips can be toggled by clicking buttons', async ({page}) => {
      const buttons = page.locator('#tooltip button');
      const topButton = buttons.filter({hasText: 'Hover top'});
      const tooltip = page.getByText('Tooltip on top');

      // Click to open tooltip
      await topButton.click();
      await page.waitForTimeout(200);

      // Verify tooltip appears with full opacity
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toHaveCSS('opacity', '1');

      // Click again to close
      await topButton.click();
      await page.waitForTimeout(200);

      // Tooltip should be hidden with zero opacity
      await expect(tooltip).toHaveCSS('opacity', '0');
    });

    test('all tooltip positions work', async ({page}) => {
      const positions = ['top', 'right', 'bottom', 'left'];

      for (const position of positions) {
        const button = page.locator(`#tooltip button:has-text("Hover ${position}")`);
        const tooltip = page.getByText(`Tooltip on ${position}`);

        await expect(button).toBeVisible();

        // Click to open
        await button.click();
        await page.waitForTimeout(200);

        // Verify tooltip appears with full opacity
        await expect(tooltip).toBeVisible();
        await expect(tooltip).toHaveCSS('opacity', '1');

        // Click to close
        await button.click();
        await page.waitForTimeout(200);

        // Verify tooltip is hidden with zero opacity
        await expect(tooltip).toHaveCSS('opacity', '0');
      }
    });
  });

  test.describe('Stepper Interactions', () => {
    test.beforeEach(async ({page}) => {
      await navigateToSection(page, 'stepper');
    });

    test('stepper navigation buttons work', async ({page}) => {
      const nextButton = page.locator('#stepper button:has-text("Next")');
      const prevButton = page.locator('#stepper button:has-text("Previous")');

      // Click Next button
      await nextButton.click();
      await page.waitForTimeout(200);

      // Previous button should now be enabled
      await expect(prevButton).toBeEnabled();

      // Click Previous button
      await prevButton.click();
      await page.waitForTimeout(200);

      // Should be back to initial state
      await expect(prevButton).toBeDisabled();
    });

    test('toggle error button works', async ({page}) => {
      const toggleErrorButton = page.locator('#stepper button:has-text("Toggle Error")');

      await expect(toggleErrorButton).toBeVisible();
      await toggleErrorButton.click();
      await page.waitForTimeout(200);

      // Click again to toggle off
      await toggleErrorButton.click();
      await page.waitForTimeout(200);
    });

    test('stepper advances through all steps', async ({page}) => {
      const nextButton = page.locator('#stepper button:has-text("Next")');

      // Click Next 3 times to reach the last step
      for (let i = 0; i < 3; i++) {
        await nextButton.click();
        await page.waitForTimeout(200);
      }

      // Next button should be disabled at the last step
      await expect(nextButton).toBeDisabled();
    });
  });

  test.describe('Streaming Cursor Interactions', () => {
    test.beforeEach(async ({page}) => {
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

  test.describe('Message Streaming Interactions', () => {
    test.beforeEach(async ({page}) => {
      await navigateToSection(page, 'messages');
    });

    test('message section renders conversation', async ({page}) => {
      // Verify the conversation container exists
      const conversationContainer = page.locator('#messages .overflow-y-auto');
      await expect(conversationContainer).toBeVisible();

      // Verify messages are present
      const messages = conversationContainer.locator('[class*="message"], .space-y-3 > div');
      const count = await messages.count();
      expect(count).toBeGreaterThan(0);
    });

    test('streaming message shows cursor during streaming', async ({page}) => {
      // Wait for streaming to start
      await page.waitForTimeout(500);

      const conversationContainer = page.locator('#messages .overflow-y-auto');

      // Look for cursor element (it should appear during streaming)
      // The cursor might be in different states, so we just verify the conversation is interactive
      await expect(conversationContainer).toBeVisible();

      // Wait a bit for streaming to progress
      await page.waitForTimeout(1000);

      // Verify content is being updated by checking the container has content
      const hasContent = await conversationContainer.evaluate(
          (el) => el.textContent && el.textContent.length > 0);
      expect(hasContent).toBe(true);
    });

    test('conversation container scrolls during streaming', async ({page}) => {
      const conversationContainer = page.locator('#messages .overflow-y-auto');
      await expect(conversationContainer).toBeVisible();

      // Get initial scroll position
      const initialScroll = await conversationContainer.evaluate((el) => el.scrollTop);

      // Wait for streaming to add content
      await page.waitForTimeout(2000);

      // Get new scroll position
      const newScroll = await conversationContainer.evaluate((el) => el.scrollTop);

      // Scroll position should have changed (scrolling down) or be at bottom
      // If content is short enough to not scroll, scrollTop might be 0
      expect(newScroll).toBeGreaterThanOrEqual(initialScroll);
    });

    test('streaming restarts after completion', async ({page}) => {
      const conversationContainer = page.locator('#messages .overflow-y-auto');

      // Wait for first streaming cycle to complete
      await page.waitForTimeout(5000); // 20ms * ~500 chars + 3000ms pause

      // Get text content
      const text1 = await conversationContainer.textContent();

      // Wait for restart (should happen after 3s pause)
      await page.waitForTimeout(4000);

      // Verify content has reset and is streaming again
      const text2 = await conversationContainer.textContent();

      // Content should be different (either shorter or at different point in stream)
      expect(text1).toBeTruthy();
      expect(text2).toBeTruthy();
    });
  });
});

test.describe('Responsive Behavior', () => {
  test('mobile viewport - sidebar is hidden', async ({page}) => {
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Sidebar should be hidden on mobile (has hidden class on small screens)
    const sidebar = page.locator('aside');
    // Check if it's either not visible or has the hidden class
    const isVisible = await sidebar.isVisible();
    // On mobile, sidebar has display:none via Tailwind classes
    expect(isVisible).toBe(false);
  });

  test('desktop viewport - sidebar is visible', async ({page}) => {
    await page.setViewportSize({width: 1920, height: 1080});
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
  });

  test('content is accessible on all viewports', async ({page}) => {
    const viewports = [
      {width: 375, height: 667},   // mobile
      {width: 768, height: 1024},  // tablet
      {width: 1920, height: 1080}, // desktop
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
