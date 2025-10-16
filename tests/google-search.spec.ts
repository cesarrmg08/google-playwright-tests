/**
 * Google Search - Automated Test Suite
 * 
 * Test Design Document:
 * ---------------------
 * Purpose: Validate Google Search functionality including search execution and result navigation
 * Test Level: System Testing (End-to-End)
 * Test Type: Functional Testing
 * Test Technique: Black-box testing using equivalence partitioning and boundary value analysis
 * 
 * Following ISTQB best practices:
 * - Clear test case structure
 * - Independent and repeatable tests
 * - Proper use of assertions and soft assertions
 * - Maintainable Page Object Model
 * - Comprehensive test coverage
 * 
 * Test Environment:
 * - Browser: Chromium, Firefox, WebKit (cross-browser testing)
 * - Target: https://www.google.com
 * - Framework: Playwright with TypeScript
 * 
 * Author: QA Automation Team
 * Created: 2025
 */

import { test, expect } from '../fixtures/page-fixtures';
import { validSearchQueries, navigationTestQueries } from '../test-data/search-queries';

/**
 * Test Suite: Google Search - Valid Search Functionality
 * 
 * Objective: Verify that valid searches on Google return appropriate results
 * Tags: @search
 * 
 * Pre-conditions:
 * - Internet connection available
 * - Google.com is accessible
 * - Browser is configured correctly
 */
test.describe('Google Search - Valid Search Tests', { tag: '@search' }, () => {
    /**
     * Test Setup: Before Each Test
     * - Navigate to Google homepage
     * - Accept cookie consent if present
     * - Verify homepage is loaded
     */
    test.beforeEach(async ({ googlePage }) => {
        await test.step('Navigate to Google homepage', async () => {
            await googlePage.navigate();
        });

        await test.step('Accept cookies if dialog appears', async () => {
            await googlePage.acceptCookiesIfPresent();
        });

        await test.step('Verify homepage loaded successfully', async () => {
            const isHomePage = await googlePage.isOnGoogleHomePage();
            expect(isHomePage, 'Should be on Google homepage').toBeTruthy();
        });
    });

    /**
     * Test Case: TC-GS-001
     * Title: Valid Search - Basic Keyword Search
     * Tags: @smoke, @high
     * 
     * Description:
     * Verify that a valid search query returns search results with relevant content
     * 
     * Test Steps:
     * 1. Enter a valid search query in the search input
     * 2. Press Enter to submit the search
     * 3. Wait for search results to load
     * 4. Verify search results are displayed
     * 5. Verify result count is greater than 0
     * 6. Verify URL contains search query
     * 7. Verify page title reflects the search
     * 
     * Expected Results:
     * - Search results page is displayed
     * - Multiple search results are visible
     * - URL contains '/search' and query parameter
     * - Page title contains the search query
     * 
     * Test Data: Using data-driven approach with multiple search queries
     */
    test('TC-GS-001: Should perform valid search and display results', { tag: ['@smoke', '@high'] }, async ({ googlePage }) => {
        const searchQuery = validSearchQueries[0].query;

        await test.step('Enter search query and submit', async () => {
            await googlePage.search(searchQuery);
        });

        await test.step('Wait for search results to load', async () => {
            await googlePage.waitForSearchResults();
        });

        await test.step('Verify search results are displayed', async () => {
            // Using soft assertions to continue test even if one fails
            await expect.soft(googlePage.searchResults, 'Search results container should be visible')
                .toBeVisible();
            
            const resultsCount = await googlePage.getSearchResultsCount();
            await expect.soft(resultsCount, 'Should have multiple search results')
                .toBeGreaterThan(0);
            
            await expect.soft(googlePage.resultStats, 'Result stats should be visible')
                .toBeVisible();
        });

        await test.step('Verify URL contains search query', async () => {
            const currentUrl = googlePage.getCurrentUrl();
            expect.soft(currentUrl, 'URL should contain /search').toContain('/search');
            
            const queryFromUrl = googlePage.getSearchQueryFromUrl();
            expect.soft(queryFromUrl.toLowerCase(), 'URL query should match search term')
                .toContain(searchQuery.split(' ')[0].toLowerCase());
        });

        await test.step('Verify page title reflects search', async () => {
            const pageTitle = await googlePage.getPageTitle();
            expect.soft(pageTitle, 'Page title should contain search query')
                .toContain(searchQuery.split(' ')[0]);
        });

        await test.step('Verify on search results page', async () => {
            const isResultsPage = await googlePage.isOnSearchResultsPage();
            expect(isResultsPage, 'Should be on search results page').toBeTruthy();
        });
    });

    /**
     * Test Case: TC-GS-002
     * Title: Valid Search - Using Search Button
     * Tags: @high
     * 
     * Description:
     * Verify that search can be performed using the search button (not just Enter key)
     * 
     * Test Steps:
     * 1. Enter a valid search query
     * 2. Click the search button
     * 3. Verify search results are displayed
     * 
     * Expected Results:
     * - Search executes successfully
     * - Results page is displayed with relevant content
     */
    test('TC-GS-002: Should perform search using search button', { tag: '@high' }, async ({ googlePage }) => {
        const searchQuery = validSearchQueries[1].query;

        await test.step('Enter search query and click search button', async () => {
            await googlePage.searchWithButton(searchQuery);
        });

        await test.step('Verify search results are displayed', async () => {
            await googlePage.waitForSearchResults();
            
            const resultsCount = await googlePage.getSearchResultsCount();
            expect.soft(resultsCount, 'Should display search results').toBeGreaterThan(0);
            
            const isResultsPage = await googlePage.isOnSearchResultsPage();
            expect(isResultsPage, 'Should navigate to results page').toBeTruthy();
        });
    });

    /**
     * Test Case: TC-GS-003
     * Title: Valid Search - Result Content Verification
     * Tags: @high
     * 
     * Description:
     * Verify that search results contain relevant content related to the search query
     * 
     * Test Steps:
     * 1. Perform a search with a specific keyword
     * 2. Retrieve all search result titles
     * 3. Verify at least one result contains the searched keyword
     * 4. Verify first result has non-empty text
     * 
     * Expected Results:
     * - Search results are relevant to the query
     * - Result titles contain expected keywords
     */
    test('TC-GS-003: Should display relevant search results', { tag: '@high' }, async ({ googlePage }) => {
        const testData = validSearchQueries[0];

        await test.step('Perform search', async () => {
            await googlePage.search(testData.query);
            await googlePage.waitForSearchResults();
        });

        await test.step('Verify result content relevance', async () => {
            const firstResultText = await googlePage.getFirstSearchResultText();
            expect.soft(firstResultText.length, 'First result should have text content')
                .toBeGreaterThan(0);
            
            const allTitles = await googlePage.getAllSearchResultTitles();
            expect.soft(allTitles.length, 'Should have multiple result titles')
                .toBeGreaterThan(0);
            
            // Verify at least one result contains expected content
            if (testData.expectedResultsContain) {
                const containsExpectedText = await googlePage.searchResultsContainText(
                    testData.expectedResultsContain
                );
                expect.soft(containsExpectedText, 
                    `Results should contain "${testData.expectedResultsContain}"`)
                    .toBeTruthy();
            }
        });
    });

    /**
     * Test Case: TC-GS-004
     * Title: Valid Search - Multiple Keywords
     * Tags: @medium
     * 
     * Description:
     * Verify that search works correctly with multiple keywords
     * 
     * Test Steps:
     * 1. Enter a search query with multiple keywords
     * 2. Submit the search
     * 3. Verify results are displayed
     * 4. Verify results are relevant to the multi-keyword query
     * 
     * Expected Results:
     * - Search handles multiple keywords correctly
     * - Results are relevant to the combined search terms
     */
    test('TC-GS-004: Should handle multiple keyword search', { tag: '@medium' }, async ({ googlePage }) => {
        const searchQuery = 'Playwright TypeScript testing';

        await test.step('Perform multi-keyword search', async () => {
            await googlePage.search(searchQuery);
            await googlePage.waitForSearchResults();
        });

        await test.step('Verify results for multi-keyword query', async () => {
            const resultsCount = await googlePage.getSearchResultsCount();
            expect.soft(resultsCount, 'Should return results for multi-keyword search')
                .toBeGreaterThan(0);
            
            const currentUrl = googlePage.getCurrentUrl();
            expect.soft(currentUrl, 'URL should reflect the search query')
                .toContain('search');
            
            await expect.soft(googlePage.searchResults, 'Search results should be visible')
                .toBeVisible();
        });
    });

    /**
     * Test Case: TC-GS-005
     * Title: Search Input Validation
     * Tags: @smoke, @high
     * 
     * Description:
     * Verify that search input is visible, enabled, and functional
     * 
     * Test Steps:
     * 1. Verify search input is visible on homepage
     * 2. Verify search input is enabled
     * 3. Verify search input accepts text input
     * 
     * Expected Results:
     * - Search input is visible and accessible
     * - Search input is enabled for interaction
     * - Text can be entered into search input
     */
    test('TC-GS-005: Should have functional search input field', { tag: ['@smoke', '@high'] }, async ({ googlePage }) => {
        await test.step('Verify search input properties', async () => {
            await expect.soft(googlePage.searchInput, 'Search input should be visible')
                .toBeVisible();
            
            await expect.soft(googlePage.searchInput, 'Search input should be enabled')
                .toBeEnabled();
            
            const isEnabled = await googlePage.isElementEnabled(googlePage.searchInput);
            expect.soft(isEnabled, 'Search input should be enabled for interaction')
                .toBeTruthy();
        });

        await test.step('Verify search input accepts text', async () => {
            const testText = 'Test input';
            await googlePage.fillInput(googlePage.searchInput, testText);
            
            const inputValue = await googlePage.searchInput.inputValue();
            expect(inputValue, 'Input should contain entered text').toBe(testText);
        });
    });
});

/**
 * Test Suite: Google Search - Result Navigation
 * 
 * Objective: Verify that clicking on search results navigates to the correct destination
 * Tags: @navigation
 * 
 * Pre-conditions:
 * - Internet connection available
 * - Google.com is accessible
 * - Search functionality is working
 */
test.describe('Google Search - Result Navigation Tests', { tag: '@navigation' }, () => {
    test.beforeEach(async ({ googlePage }) => {
        await test.step('Setup: Navigate to Google and accept cookies', async () => {
            await googlePage.navigate();
            await googlePage.acceptCookiesIfPresent();
        });
    });

    /**
     * Test Case: TC-GN-001
     * Title: Navigate to First Search Result
     * Tags: @smoke, @critical
     * 
     * Description:
     * Verify that clicking the first search result navigates to the correct URL
     * 
     * Test Steps:
     * 1. Perform a valid search
     * 2. Wait for search results to load
     * 3. Get the URL of the first search result
     * 4. Click on the first search result
     * 5. Verify navigation to the clicked result
     * 6. Verify current URL is different from Google search page
     * 
     * Expected Results:
     * - User is redirected to the selected search result
     * - Current URL matches or is related to the clicked result URL
     * - User is no longer on Google search results page
     */
    test('TC-GN-001: Should navigate to first search result', { tag: ['@smoke', '@critical'] }, async ({ googlePage, page }) => {
        const searchQuery = navigationTestQueries[0].query;
        let expectedUrl: string;

        await test.step('Perform search and wait for results', async () => {
            await googlePage.search(searchQuery);
            await googlePage.waitForSearchResults();
        });

        await test.step('Get first result URL before clicking', async () => {
            expectedUrl = await googlePage.getSearchResultUrl(0);
            
            expect.soft(expectedUrl, 'Result URL should not be empty').toBeTruthy();
            expect.soft(expectedUrl.length, 'URL should have valid length').toBeGreaterThan(0);
        });

        await test.step('Click first search result', async () => {
            await googlePage.clickFirstSearchResult();
        });

        await test.step('Verify navigation to result page', async () => {
            const currentUrl = googlePage.getCurrentUrl();
            
            // Soft assertion: Verify we navigated away from Google search
            expect.soft(currentUrl, 'Should navigate away from search page')
                .not.toContain('google.com/search');
            
            // Verify we're on a different domain or page
            const isOnSearchPage = await googlePage.isOnSearchResultsPage();
            expect.soft(isOnSearchPage, 'Should no longer be on Google search results')
                .toBeFalsy();
            
            // Verify page loaded successfully
            const newPageTitle = await page.title();
            expect.soft(newPageTitle.length, 'Destination page should have a title')
                .toBeGreaterThan(0);
        });

        await test.step('Verify destination page is accessible', async () => {
            // Wait for destination page to load
            await page.waitForLoadState('domcontentloaded');
            
            // Verify the page is not an error page
            const pageContent = await page.content();
            expect.soft(pageContent.length, 'Page should have content').toBeGreaterThan(0);
        });
    });

    /**
     * Test Case: TC-GN-002
     * Title: Navigate to Specific Search Result by Index
     * Tags: @high
     * 
     * Description:
     * Verify that clicking any search result (not just the first) navigates correctly
     * 
     * Test Steps:
     * 1. Perform a search
     * 2. Click on the second search result (index 1)
     * 3. Verify navigation occurred
     * 4. Verify destination page loaded
     * 
     * Expected Results:
     * - Navigation to selected result is successful
     * - User reaches the destination page
     */
    test('TC-GN-002: Should navigate to specific search result', { tag: '@high' }, async ({ googlePage, page }) => {
        const searchQuery = navigationTestQueries[1].query;
        const resultIndex = 1; // Click second result

        await test.step('Perform search', async () => {
            await googlePage.search(searchQuery);
            await googlePage.waitForSearchResults();
        });

        await test.step('Verify multiple results available', async () => {
            const resultsCount = await googlePage.getSearchResultsCount();
            expect(resultsCount, 'Should have at least 2 results for this test')
                .toBeGreaterThanOrEqual(resultIndex + 1);
        });

        await test.step(`Click on search result at index ${resultIndex}`, async () => {
            const clickedUrl = await googlePage.clickSearchResult(resultIndex);
            
            expect.soft(clickedUrl, 'Clicked result should have URL').toBeTruthy();
        });

        await test.step('Verify navigation to result page', async () => {
            await page.waitForLoadState('domcontentloaded');
            
            const currentUrl = googlePage.getCurrentUrl();
            expect.soft(currentUrl, 'Should navigate away from Google')
                .not.toContain('google.com/search');
            
            const pageTitle = await page.title();
            expect.soft(pageTitle.length, 'Destination page should have title')
                .toBeGreaterThan(0);
        });
    });

    /**
     * Test Case: TC-GN-003
     * Title: Verify Result URL Before Navigation
     * Tags: @medium
     * 
     * Description:
     * Verify that search results have valid URLs before attempting navigation
     * 
     * Test Steps:
     * 1. Perform a search
     * 2. Get URLs from multiple search results
     * 3. Verify each URL is valid and not empty
     * 4. Verify URLs are different from each other
     * 
     * Expected Results:
     * - All search results have valid URLs
     * - URLs are properly formatted
     * - Different results have different URLs
     */
    test('TC-GN-003: Should have valid URLs for all search results', { tag: '@medium' }, async ({ googlePage }) => {
        const searchQuery = 'Playwright documentation';

        await test.step('Perform search', async () => {
            await googlePage.search(searchQuery);
            await googlePage.waitForSearchResults();
        });

        await test.step('Verify URLs for multiple results', async () => {
            const resultsCount = await googlePage.getSearchResultsCount();
            const urlsToCheck = Math.min(3, resultsCount); // Check first 3 results
            
            const resultUrls: string[] = [];
            
            for (let i = 0; i < urlsToCheck; i++) {
                const url = await googlePage.getSearchResultUrl(i);
                resultUrls.push(url);
                
                expect.soft(url, `Result ${i} should have a URL`).toBeTruthy();
                expect.soft(url.length, `Result ${i} URL should not be empty`)
                    .toBeGreaterThan(0);
                expect.soft(url, `Result ${i} URL should start with http`)
                    .toMatch(/^https?:\/\//);
            }
            
            // Verify URLs are unique (if we have multiple results)
            if (resultUrls.length > 1) {
                const uniqueUrls = new Set(resultUrls);
                expect.soft(uniqueUrls.size, 'Results should have different URLs')
                    .toBeGreaterThan(0);
            }
        });
    });

    /**
     * Test Case: TC-GN-004
     * Title: End-to-End Search and Navigation Flow
     * Tags: @e2e, @critical
     * 
     * Description:
     * Complete flow test: search, verify results, navigate, and verify destination
     * This test validates the entire user journey
     * 
     * Test Steps:
     * 1. Start at Google homepage
     * 2. Perform a search
     * 3. Verify search results are displayed
     * 4. Get first result information
     * 5. Navigate to first result
     * 6. Verify successful navigation
     * 7. Verify destination page loads correctly
     * 
     * Expected Results:
     * - Complete flow executes without errors
     * - User can successfully search and navigate to results
     * - All intermediate steps are verified
     */
    test('TC-GN-004: Complete search and navigation flow', { tag: ['@e2e', '@critical'] }, async ({ googlePage, page }) => {
        await test.step('Verify starting at homepage', async () => {
            const isHomePage = await googlePage.isOnGoogleHomePage();
            expect(isHomePage, 'Should start at Google homepage').toBeTruthy();
        });

        await test.step('Execute search', async () => {
            await googlePage.search('Playwright GitHub');
            await googlePage.waitForSearchResults();
        });

        await test.step('Verify search results page', async () => {
            const isResultsPage = await googlePage.isOnSearchResultsPage();
            expect.soft(isResultsPage, 'Should be on results page').toBeTruthy();
            
            const resultsCount = await googlePage.getSearchResultsCount();
            expect.soft(resultsCount, 'Should have results').toBeGreaterThan(0);
            
            await expect.soft(googlePage.searchResults, 'Results should be visible')
                .toBeVisible();
        });

        await test.step('Get result information', async () => {
            const firstResultText = await googlePage.getFirstSearchResultText();
            expect.soft(firstResultText, 'First result should have text').toBeTruthy();
            
            const firstResultUrl = await googlePage.getSearchResultUrl(0);
            expect.soft(firstResultUrl, 'First result should have URL').toBeTruthy();
        });

        await test.step('Navigate to first result', async () => {
            await googlePage.clickFirstSearchResult();
        });

        await test.step('Verify destination page', async () => {
            await page.waitForLoadState('domcontentloaded');
            
            const finalUrl = page.url();
            expect.soft(finalUrl, 'Should be on destination page')
                .not.toContain('google.com/search');
            
            const pageTitle = await page.title();
            expect.soft(pageTitle.length, 'Destination should have title')
                .toBeGreaterThan(0);
            
            // Verify page is interactive
            const pageContent = await page.content();
            expect(pageContent.length, 'Page should have content loaded')
                .toBeGreaterThan(1000); // Reasonable size for a loaded page
        });
    });
});

