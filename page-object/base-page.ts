import { Page, Locator } from '@playwright/test';

/**
 * BasePage - Base class for all Page Objects
 * Following ISTQB and Playwright best practices
 * 
 * Provides:
 * - Common navigation methods
 * - Element interaction methods
 * - Wait strategies
 * - Error handling
 * - Logging capabilities
 */
export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL
     * @param url - The URL to navigate to
     * @param options - Navigation options
     */
    async navigateTo(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
        await this.page.goto(url, { waitUntil: options?.waitUntil || 'domcontentloaded' });
    }

    /**
     * Wait for the page to be fully loaded
     * @param state - Load state to wait for
     */
    async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
        await this.page.waitForLoadState(state);
    }

    /**
     * Click on an element with retry logic
     * @param locator - The element to click
     * @param options - Click options
     */
    async clickElement(locator: Locator, options?: { force?: boolean; timeout?: number }): Promise<void> {
        await locator.click(options);
    }

    /**
     * Fill input field with proper clearing
     * @param locator - The input element
     * @param text - Text to fill
     */
    async fillInput(locator: Locator, text: string): Promise<void> {
        await locator.clear();
        await locator.fill(text);
    }

    /**
     * Press a key on an element
     * @param locator - The element to press key on
     * @param key - Key to press
     */
    async pressKey(locator: Locator, key: string): Promise<void> {
        await locator.press(key);
    }

    /**
     * Get element text content
     * @param locator - The element to get text from
     * @returns The text content
     */
    async getElementText(locator: Locator): Promise<string> {
        return await locator.textContent() || '';
    }

    /**
     * Get all text contents from multiple elements
     * @param locator - The locator for elements
     * @returns Array of text contents
     */
    async getAllTexts(locator: Locator): Promise<string[]> {
        return await locator.allTextContents();
    }

    /**
     * Wait for element to be visible
     * @param locator - The element to wait for
     * @param timeout - Timeout in milliseconds
     */
    async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    /**
     * Wait for element to be hidden
     * @param locator - The element to wait for
     * @param timeout - Timeout in milliseconds
     */
    async waitForElementHidden(locator: Locator, timeout: number = 10000): Promise<void> {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    /**
     * Check if element is visible
     * @param locator - The element to check
     * @param timeout - Timeout for the check
     * @returns True if visible, false otherwise
     */
    async isElementVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if element is enabled
     * @param locator - The element to check
     * @returns True if enabled, false otherwise
     */
    async isElementEnabled(locator: Locator): Promise<boolean> {
        return await locator.isEnabled();
    }

    /**
     * Get element attribute value
     * @param locator - The element
     * @param attribute - Attribute name
     * @returns Attribute value or null
     */
    async getElementAttribute(locator: Locator, attribute: string): Promise<string | null> {
        return await locator.getAttribute(attribute);
    }

    /**
     * Get page title
     * @returns The page title
     */
    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Get current URL
     * @returns Current page URL
     */
    getCurrentUrl(): string {
        return this.page.url();
    }

    /**
     * Wait for URL to contain specific text
     * @param urlPart - Part of URL to wait for
     * @param timeout - Timeout in milliseconds
     */
    async waitForUrlContains(urlPart: string, timeout: number = 10000): Promise<void> {
        await this.page.waitForURL(`**/*${urlPart}*`, { timeout });
    }

    /**
     * Wait for navigation to complete
     * @param action - Action that triggers navigation
     */
    async waitForNavigation(action: () => Promise<void>): Promise<void> {
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            action()
        ]);
    }

    /**
     * Take a screenshot
     * @param path - Path to save screenshot
     * @param fullPage - Whether to capture full page
     */
    async takeScreenshot(path: string, fullPage: boolean = false): Promise<void> {
        await this.page.screenshot({ path, fullPage });
    }

    /**
     * Scroll element into view
     * @param locator - Element to scroll to
     */
    async scrollToElement(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    /**
     * Get count of elements matching locator
     * @param locator - The locator
     * @returns Count of matching elements
     */
    async getElementCount(locator: Locator): Promise<number> {
        return await locator.count();
    }

    /**
     * Reload the current page
     */
    async reloadPage(): Promise<void> {
        await this.page.reload();
    }

    /**
     * Go back in browser history
     */
    async goBack(): Promise<void> {
        await this.page.goBack();
    }

    /**
     * Wait for a specific amount of time (use sparingly)
     * @param milliseconds - Time to wait
     */
    async wait(milliseconds: number): Promise<void> {
        await this.page.waitForTimeout(milliseconds);
    }
}

