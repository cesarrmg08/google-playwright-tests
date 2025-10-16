/**
 * Google Search Tests
 * 
 * Test Coverage:
 * a. Valid Search - Verify search functionality and results display
 * b. Search Result Navigation - Verify clicking results navigates correctly
 * 
 * Best Practices Applied:
 * - Page Object Model with getters for locators
 * - Playwright's auto-waiting (no explicit waits)
 * - Reusable page object methods
 * - Clean, maintainable test structure
 * - Custom fixtures for dependency injection
 */

import { test, expect } from '../fixtures/page-fixtures';

test.describe('Google Search Tests', () => {

    test.beforeEach(async ({ googlePage }) => {
        await googlePage.navigate();
        await googlePage.acceptCookiesIfPresent();
    });

    /**
     * Test a: Valid Search
     * 
     * Validates that performing a search displays results on the search results page
     */
    test('a. Valid Search - should display search results', async ({ googlePage }) => {
        const searchQuery = 'Playwright';
        
        // Perform search using page object method
        await googlePage.search(searchQuery);
        
        // Verify we're on search results page
        await googlePage.verifyOnSearchResultsPage();
        
        // Verify search results are displayed
        const hasResults = await googlePage.hasSearchResults();
        expect(hasResults, 'Search results should be displayed').toBeTruthy();
        
        // Verify URL contains search query
        const currentUrl = googlePage.getCurrentUrl();
        expect(currentUrl).toContain('/search');
        expect(currentUrl).toContain('q=');
    });

    /**
     * Test b: Search Result Navigation
     * 
     * Validates that clicking a search result navigates to the correct destination URL
     */
    test('b. Search Result Navigation - should navigate to clicked result', async ({ googlePage, page }) => {
        const searchQuery = 'Wikipedia';
        
        // Perform search using page object method
        await googlePage.search(searchQuery);
        
        // Verify on results page
        await googlePage.verifyOnSearchResultsPage();
        
        // Get first result link and verify it exists
        const resultLink = await googlePage.getFirstResultLink();
        await expect(resultLink).toBeVisible();
        
        // Store search page URL for comparison
        const searchPageUrl = googlePage.getCurrentUrl();
        
        // Click first result using page object method
        await googlePage.clickFirstSearchResult();
        
        // Verify navigation occurred
        const destinationUrl = googlePage.getCurrentUrl();
        expect(destinationUrl).not.toBe(searchPageUrl);
        expect(destinationUrl).not.toContain('google.com/search');
        
        // Verify destination page loaded
        const pageTitle = await page.title();
        expect(pageTitle.length).toBeGreaterThan(0);
    });
});
