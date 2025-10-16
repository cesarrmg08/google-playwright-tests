/**
 * Custom Playwright Fixtures
 * Following Playwright best practices for Page Object Model
 * 
 * Fixtures provide:
 * - Automatic setup and teardown
 * - Dependency injection for page objects
 * - Type-safe page object access
 * - Better test organization and maintainability
 */

import { test as base } from '@playwright/test';
import { GooglePage } from '../page-object/google-page';

/**
 * Extended test fixtures with page objects
 */
type PageFixtures = {
    googlePage: GooglePage;
};

/**
 * Extend base test with custom fixtures
 * Usage in tests: test('test name', async ({ googlePage }) => { ... })
 */
export const test = base.extend<PageFixtures>({
    /**
     * Google Page fixture
     * Automatically initializes GooglePage for each test
     */
    googlePage: async ({ page }, use) => {
        const googlePage = new GooglePage(page);
        await use(googlePage);
    },
});

export { expect } from '@playwright/test';

