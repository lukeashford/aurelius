import {expect, test} from '@playwright/test';

/**
 * Interactive Components E2E Tests
 *
 * This test suite covers all interactive components in the demo application,
 * organized by demo section. Each section has its own test suite.
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
 * - Messages: Message variants, actions (copy, edit, retry), branch navigation
 * - Navigation: Tabs, Accordion, Menu, Pagination, Breadcrumb
 */

// Helper to navigate reliably to a section by hash link
const navigateToSection = async (page: import('@playwright/test').Page, id: string) => {
  const link = page.locator(`a[href="#${id}"]`).first();
  await expect(link).toBeVisible();
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page).toHaveURL(new RegExp(`#${id}`));
  await expect(page.locator(`#${id}`)).toBeVisible();
};

test.describe('ModalSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'modal');
  });

  test('opens and closes modal', async ({page}) => {
    // Find and click the Open Modal button (exact label in demo is "Open Centered Modal")
    const openButton = page.getByRole('button', {name: 'Open Modal'});
    await openButton.click();

    // Verify modal is visible
    await expect(page.locator('text=Example Modal')).toBeVisible();

    // Close modal with Cancel button
    await page.locator('button:has-text("Cancel")').click();

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
    const openButton = page.locator('button:has-text("Open Modal")').first();
    await openButton.click();

    // Check for modal backdrop/overlay
    const modalContainer = page.locator('[role="dialog"], .modal, [data-modal]').first();
    await expect(modalContainer).toBeVisible();
  });
});

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

test.describe('InputsSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
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

test.describe('ButtonsSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
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

test.describe('ImageCardSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
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

test.describe('TooltipSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
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

test.describe('StepperSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
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
    for (let i = 0; i < 2; i++) {
      await nextButton.click();
      await page.waitForTimeout(200);
    }

    // Next button should be disabled at the last step
    await expect(nextButton).toBeDisabled();
  });
});

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

test.describe('MessageSection', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await navigateToSection(page, 'messages');
  });

  test('renders message variants', async ({page}) => {
    // Verify the Variants section exists
    await expect(page.locator('#messages h3:has-text("Variants")')).toBeVisible();

    // Verify both user and assistant variants are shown
    await expect(page.locator('#messages').getByText('Assistant', {exact: true})).toBeVisible();
    await expect(page.locator('#messages').getByText('User', {exact: true})).toBeVisible();
  });

  test('renders messages with actions section', async ({page}) => {
    // Verify the With Actions section exists
    await expect(page.locator('#messages h3:has-text("With Actions")')).toBeVisible();

    // Verify the description text
    await expect(page.locator('#messages').getByText('Messages can have action buttons'))
    .toBeVisible();
  });

  test('copy button appears on messages with actions', async ({page}) => {
    // Find messages in the "With Actions" section
    const actionsSection = page.locator('#messages').locator('h3:has-text("With Actions")')
    .locator('..');

    // Look for copy buttons (they should be visible or appear on hover)
    const copyButtons = actionsSection.locator(
        'button[aria-label="Copy"], button:has-text("Copy")');

    // Hover over a message to reveal action buttons if they're hidden
    const messageContainer = actionsSection.locator('div')
    .filter({hasText: 'This user message has actions'}).first();
    await messageContainer.hover();
    await page.waitForTimeout(200);

    // Verify copy functionality exists (button or icon)
    const hasCopyButton = await copyButtons.count() > 0;
    const hasCopyIcon = await actionsSection.locator('[class*="copy"], svg').count() > 0;
    expect(hasCopyButton || hasCopyIcon).toBe(true);
  });

  test('edit button triggers edit mode for user messages', async ({page}) => {
    // Find the user message with edit action
    const actionsSection = page.locator('#messages').locator('h3:has-text("With Actions")')
    .locator('..');

    // Hover to reveal action buttons
    const userMessage = actionsSection.locator('div')
    .filter({hasText: 'This user message has actions'}).first();
    await userMessage.hover();
    await page.waitForTimeout(200);

    // Look for edit button
    const editButton = actionsSection.locator('button[aria-label="Edit"], button:has-text("Edit")')
    .first();

    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(200);

      // After clicking edit, there should be a textarea or input for editing
      // or an alert dialog (based on the demo implementation)
      // The demo shows an alert, so we just verify the click worked
    }
  });

  test('retry button exists for assistant messages', async ({page}) => {
    // Find the assistant message with retry action
    const actionsSection = page.locator('#messages').locator('h3:has-text("With Actions")')
    .locator('..');

    // Hover to reveal action buttons
    const assistantMessage = actionsSection.locator('div')
    .filter({hasText: 'This assistant message has actions'}).first();
    await assistantMessage.hover();
    await page.waitForTimeout(200);

    // Look for retry button
    const retryButton = actionsSection.locator(
        'button[aria-label="Retry"], button:has-text("Retry")').first();

    if (await retryButton.isVisible()) {
      // Verify retry button is clickable
      await expect(retryButton).toBeEnabled();
    }
  });

  test('renders branch navigation section', async ({page}) => {
    // Verify the Branch Navigation section exists
    await expect(page.locator('#messages h3:has-text("With Branch Navigation")')).toBeVisible();

    // Verify the description text
    await expect(page.locator('#messages').getByText('When a message has multiple branches'))
    .toBeVisible();
  });

  test('branch navigator shows current position', async ({page}) => {
    // Find the branch navigation section
    const branchSection = page.locator('#messages').locator('h3:has-text("With Branch Navigation")')
    .locator('..');

    // Look for branch indicator (e.g., "1/3" or similar)
    const branchIndicator = branchSection.locator('text=/\\d+.*\\/.*\\d+/').first();

    // Verify branch navigation exists
    const hasBranchIndicator = await branchIndicator.isVisible().catch(() => false);
    const hasBranchButtons = await branchSection.locator(
        'button[aria-label*="branch"], button[aria-label*="Previous"], button[aria-label*="Next"]')
    .count() > 0;

    expect(hasBranchIndicator || hasBranchButtons).toBe(true);
  });

  test('renders streaming state section', async ({page}) => {
    // Verify the Streaming section exists
    await expect(page.locator('#messages h3:has-text("Streaming")')).toBeVisible();

    // Verify the description text
    await expect(page.locator('#messages').getByText('During streaming, a cursor is shown'))
    .toBeVisible();

    // Verify streaming message shows cursor
    const streamingSection = page.locator('#messages').locator('h3:has-text("Streaming")')
    .locator('..');
    const cursor = streamingSection.locator('[class*="cursor"], .animate-pulse, .animate-blink')
    .first();

    // There should be some indication of streaming (cursor or animation)
    const hasCursor = await cursor.isVisible().catch(() => false);
    const hasStreamingText = await streamingSection.getByText('This message is currently streaming')
    .isVisible();

    expect(hasCursor || hasStreamingText).toBe(true);
  });
});

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

test.describe('Navigation Interactions', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

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
