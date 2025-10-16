/**
 * Environment Configuration
 * Manages environment variables and test configuration settings
 */

export const config = {
    // Base URL for the application under test
    baseUrl: process.env.BASE_URL || 'https://www.google.com',
    
    // Test environment
    testEnv: process.env.TEST_ENV || 'production',
    
    // Browser settings
    headless: process.env.HEADLESS === 'false' ? false : true,
    slowMo: parseInt(process.env.SLOWMO || '0'),
    
    // Timeout settings (in milliseconds)
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
    
    // Screenshot and video settings
    screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
    videoOnFailure: process.env.VIDEO_ON_FAILURE !== 'false',
    
    // Test data
    defaultSearchQuery: process.env.DEFAULT_SEARCH_QUERY || 'Playwright automation',
} as const;

export type Config = typeof config;

