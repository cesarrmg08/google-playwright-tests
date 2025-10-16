import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * GooglePage - Page Object for Google Search
 * Following Page Object Model best practices with getters for locators
 * 
 * Test Coverage:
 * - Search functionality
 * - Navigation to search results
 * - Search result interaction
 */
export class GooglePage extends BasePage {
    private readonly url = 'https://www.google.com';

    constructor(page: Page) {
        super(page);
    }

    // ==================== LOCATORS (using getters) ====================
    
    /**
     * Main search input field
     */
    get searchInput(): Locator {
        return this.page.locator('textarea[name="q"]');
    }

    /**
     * Google Search button
     */
    get searchButton(): Locator {
        return this.page.locator('input[name="btnK"]').first();
    }

    /**
     * I'm Feeling Lucky button
     */
    get luckyButton(): Locator {
        return this.page.locator('input[name="btnI"]').first();
    }

    /**
     * Search results container
     */
    get searchResults(): Locator {
        return this.page.locator('#search');
    }

    /**
     * Result statistics (e.g., "About 1,234 results")
     */
    get resultStats(): Locator {
        return this.page.locator('#result-stats');
    }

    /**
     * All search result title links (h3 elements)
     */
    get searchResultLinks(): Locator {
        return this.page.locator('#search h3');
    }

    /**
     * All search result clickable links
     */
    get searchResultClickableLinks(): Locator {
        return this.page.locator('#search a[href]').filter({ has: this.page.locator('h3') });
    }

    /**
     * Individual search result container
     */
    get searchResultItems(): Locator {
        return this.page.locator('#search .g');
    }

    /**
     * Google logo
     */
    get googleLogo(): Locator {
        return this.page.locator('img[alt="Google"]');
    }

    /**
     * Search suggestions dropdown
     */
    get searchSuggestions(): Locator {
        return this.page.locator('ul[role="listbox"] li');
    }

    // ==================== PAGE ACTIONS ====================

    /**
     * Navigate to Google homepage
     */
    async navigate(): Promise<void> {
        await this.navigateTo(this.url, { waitUntil: 'domcontentloaded' });
    }

    /**
     * Accept cookies consent if present
     * Handles different cookie consent variations
     */
    async acceptCookiesIfPresent(): Promise<void> {
        try {
            const acceptButton = this.page.locator(
                'button:has-text("Accept all"), ' +
                'button:has-text("I agree"), ' +
                'button:has-text("Accept"), ' +
                '#L2AGLb'
            ).first();
            
            if (await acceptButton.isVisible({ timeout: 3000 })) {
                await acceptButton.click();
                await this.page.waitForTimeout(500); // Brief wait for consent to process
            }
        } catch (error) {
            // Cookies dialog not present or already accepted - continue test
            console.log('Cookie consent not found or already handled');
        }
    }

    /**
     * Perform search using Enter key
     * @param query - Search query text
     */
    async search(query: string): Promise<void> {
        await this.waitForElement(this.searchInput);
        await this.fillInput(this.searchInput, query);
        await this.pressKey(this.searchInput, 'Enter');
        await this.waitForPageLoad('domcontentloaded');
    }

    /**
     * Perform search using search button click
     * @param query - Search query text
     */
    async searchWithButton(query: string): Promise<void> {
        await this.waitForElement(this.searchInput);
        await this.fillInput(this.searchInput, query);
        
        // Wait for search button to become enabled
        await this.page.waitForTimeout(1000);
        await this.clickElement(this.searchButton);
        await this.waitForPageLoad('domcontentloaded');
    }

    /**
     * Wait for search results to be loaded
     * @param timeout - Timeout in milliseconds
     */
    async waitForSearchResults(timeout: number = 10000): Promise<void> {
        await this.waitForElement(this.searchResults, timeout);
    }

    /**
     * Get count of search results on current page
     * @returns Number of search results
     */
    async getSearchResultsCount(): Promise<number> {
        await this.waitForSearchResults();
        return await this.getElementCount(this.searchResultLinks);
    }

    /**
     * Get text of the first search result
     * @returns First search result title text
     */
    async getFirstSearchResultText(): Promise<string> {
        await this.waitForSearchResults();
        return await this.getElementText(this.searchResultLinks.first());
    }

    /**
     * Get all search result titles
     * @returns Array of search result titles
     */
    async getAllSearchResultTitles(): Promise<string[]> {
        await this.waitForSearchResults();
        return await this.getAllTexts(this.searchResultLinks);
    }

    /**
     * Click on a specific search result by index
     * @param index - Zero-based index of the result to click
     * @returns The URL of the clicked result
     */
    async clickSearchResult(index: number = 0): Promise<string> {
        await this.waitForSearchResults();
        
        const resultLink = this.searchResultClickableLinks.nth(index);
        await this.waitForElement(resultLink);
        
        // Get the href before clicking
        const href = await resultLink.getAttribute('href');
        
        // Scroll into view if needed
        await this.scrollToElement(resultLink);
        
        // Click and wait for navigation
        await resultLink.click();
        await this.waitForPageLoad('domcontentloaded');
        
        return href || '';
    }

    /**
     * Click on first search result
     * @returns The URL that was clicked
     */
    async clickFirstSearchResult(): Promise<string> {
        return await this.clickSearchResult(0);
    }

    /**
     * Get URL/href of a specific search result
     * @param index - Zero-based index of the result
     * @returns The href attribute of the result link
     */
    async getSearchResultUrl(index: number = 0): Promise<string> {
        await this.waitForSearchResults();
        const resultLink = this.searchResultClickableLinks.nth(index);
        return await this.getElementAttribute(resultLink, 'href') || '';
    }

    /**
     * Verify if on Google homepage
     * @returns True if on homepage, false otherwise
     */
    async isOnGoogleHomePage(): Promise<boolean> {
        const logoVisible = await this.isElementVisible(this.googleLogo);
        const urlContainsGoogle = this.getCurrentUrl().includes('google.com');
        const isSearchPage = this.getCurrentUrl().includes('/search');
        
        return logoVisible && urlContainsGoogle && !isSearchPage;
    }

    /**
     * Verify if on search results page
     * @returns True if on search results page, false otherwise
     */
    async isOnSearchResultsPage(): Promise<boolean> {
        const urlContainsSearch = this.getCurrentUrl().includes('/search');
        const resultsVisible = await this.isElementVisible(this.searchResults, 3000);
        
        return urlContainsSearch && resultsVisible;
    }

    /**
     * Get the search query from the URL
     * @returns The search query parameter from URL
     */
    getSearchQueryFromUrl(): string {
        const url = new URL(this.getCurrentUrl());
        return url.searchParams.get('q') || '';
    }

    /**
     * Verify search results contain specific text
     * @param expectedText - Text to search for in results
     * @returns True if any result contains the text, false otherwise
     */
    async searchResultsContainText(expectedText: string): Promise<boolean> {
        const titles = await this.getAllSearchResultTitles();
        return titles.some(title => 
            title.toLowerCase().includes(expectedText.toLowerCase())
        );
    }

    /**
     * Verify we are on the search results page
     * Uses Playwright's auto-waiting for URL pattern
     */
    async verifyOnSearchResultsPage(): Promise<void> {
        await this.page.waitForURL('**/search?**');
    }

    /**
     * Check if search results are present on the page
     * @returns True if results are found, false otherwise
     */
    async hasSearchResults(): Promise<boolean> {
        const h3Elements = this.page.locator('h3');
        const count = await h3Elements.count();
        return count > 0;
    }

    /**
     * Get the first search result link element
     * @returns Locator for the first clickable result
     */
    async getFirstResultLink(): Promise<any> {
        return this.page.locator('a').filter({ has: this.page.locator('h3') }).first();
    }
}

