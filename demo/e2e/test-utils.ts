import type {Page} from '@playwright/test';
import {expect} from '@playwright/test';

/**
 * Helper to navigate reliably to a section by hash link
 */
export const navigateToSection = async (page: Page, id: string) => {
  const link = page.locator(`a[href="#${id}"]`).first();
  await expect(link).toBeVisible();
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page).toHaveURL(new RegExp(`#${id}`));
  await expect(page.locator(`#${id}`)).toBeVisible();
};
