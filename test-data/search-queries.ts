/**
 * Test Data for Search Queries
 * Following ISTQB test data management practices
 */

export interface SearchTestData {
    query: string;
    description: string;
    expectedResultsContain?: string;
}

/**
 * Valid search queries for positive test scenarios
 */
export const validSearchQueries: SearchTestData[] = [
    {
        query: 'Playwright automation',
        description: 'Valid search with automation framework keyword',
        expectedResultsContain: 'Playwright',
    },
    {
        query: 'TypeScript testing framework',
        description: 'Valid search with multiple keywords',
        expectedResultsContain: 'TypeScript',
    },
    {
        query: 'End-to-End testing',
        description: 'Valid search with hyphenated term',
        expectedResultsContain: 'testing',
    },
];

/**
 * Search queries for testing navigation
 */
export const navigationTestQueries: SearchTestData[] = [
    {
        query: 'Playwright documentation',
        description: 'Search query likely to return official documentation',
        expectedResultsContain: 'Playwright',
    },
    {
        query: 'GitHub Playwright',
        description: 'Search query for repository navigation test',
        expectedResultsContain: 'GitHub',
    },
];

/**
 * Expected URLs or domains for navigation tests
 */
export const expectedDomains = {
    playwright: 'playwright.dev',
    github: 'github.com',
    microsoft: 'microsoft.com',
} as const;

