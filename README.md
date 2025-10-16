# Google Automated Test Project

A comprehensive Google search automation test project built with **TypeScript** and **Playwright**, following the **Page Object Model (POM)** design pattern with best practices.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running Tests](#running-tests)
- [Test Design](#test-design)
- [Project Architecture](#project-architecture)
- [Test Cases](#test-cases)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

This project automates Google search functionality testing with:
- ✅ **Page Object Model (POM)** with getters for locators
- ✅ **Custom Playwright Fixtures** for dependency injection
- ✅ **Soft Assertions** for comprehensive test feedback
- ✅ **Test Tags** for organized test execution
- ✅ **Data-Driven Testing** with centralized test data
- ✅ **TypeScript** for type safety and maintainability
- ✅ **Comprehensive Reporting** with screenshots and videos

---

## 📦 Prerequisites

Before running the automated tests, ensure you have the following installed:

### Required Software
- **Node.js**: Version 18.x or higher
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
  
- **npm**: Version 9.x or higher (comes with Node.js)
  - Verify installation: `npm --version`

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Internet Connection**: Required for accessing Google.com and downloading browsers
- **Disk Space**: At least 1GB for Playwright browsers
- **RAM**: Minimum 4GB recommended

### Dependencies
All project dependencies are defined in `package.json`:
- `@playwright/test`: ^1.56.0 (Playwright test framework)
- `@types/node`: ^24.7.2 (TypeScript Node.js type definitions)
- `dotenv`: ^17.2.3 (Environment variable management)

---

## 🚀 Setup Instructions

Follow these steps to set up and prepare the test environment:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/google-playwright-tests.git
cd google-playwright-tests
```

### 2. Install Project Dependencies
```bash
npm install
```
This command installs all required packages defined in `package.json`.

### 3. Install Playwright Browsers
```bash
npx playwright install
```
This downloads Chromium, Firefox, and WebKit browsers used for testing.

### 4. Configure Environment (Optional)
```bash
# Linux/Mac:
cp env.example .env

# Windows:
copy env.example .env

# Edit .env file with your preferred settings (optional)
# The default values in env.example work out of the box
```

### 5. Verify Installation
Run a single test to verify everything is set up correctly:
```bash
npm test -- --grep="@smoke"
```

### Important Notes

- The project includes an `env.example` file with all available configuration options
- Copy it to `.env` if you want to customize settings: `cp env.example .env` (or `copy env.example .env` on Windows)
- Default values work out of the box - no configuration required to start testing
- See the `env.example` file for all available environment variables

---

## 🧪 Running Tests

### Basic Test Execution

```bash
# Run all tests (headless mode)
npm test

# Run all tests (headed mode - see the browser)
npm run test:headed

# Run specific test file
npm test tests/google-search.spec.ts
```

### Run Tests by Tags

```bash
# Run smoke tests only
npm run test:smoke

# Run search functionality tests
npm run test:search

# Run navigation tests
npm run test:navigation

# Run critical priority tests
npm run test:critical

# Run high priority tests
npm run test:high
```

### Browser-Specific Testing

```bash
# Run in Chromium only
npm run test:chrome

# Run in Firefox only
npm run test:firefox

# Run in WebKit (Safari) only
npm run test:webkit
```

### Debug and Development

```bash
# Debug mode (step through tests interactively)
npm run test:debug

# UI Mode (interactive test runner with visual interface)
npm run test:ui

# Headed mode with visible browser
npm run test:headed

# Run specific test by name
npm test -- --grep="TC-GS-001"
```

### View Test Reports

```bash
# Open interactive HTML report
npm run report

# Reports are also auto-generated at:
# - playwright-report/ (HTML)
# - test-results/test-results.json (JSON)
```

---

## 📐 Test Design

### Test Strategy

This project follows **black-box testing** methodology with focus on:
- **Functional Testing**: Validating Google search features work as expected
- **End-to-End Testing**: Complete user journey from search to result navigation
- **Cross-Browser Testing**: Ensuring compatibility across Chromium, Firefox, and WebKit

### Test Levels
- **System Testing**: Testing the complete Google search application
- **Integration Testing**: Verifying interaction between search and navigation features

### Test Design Techniques
1. **Equivalence Partitioning**: Valid search queries grouped by type
2. **Boundary Value Analysis**: Testing edge cases (empty, very long queries handled by Google's validation)
3. **State Transition Testing**: Homepage → Search Results → Destination Page
4. **Use Case Testing**: Real user scenarios and flows

### Test Prioritization
Tests are prioritized using tags:
- **@critical**: Must-pass tests for core functionality
- **@high**: Important features that should work correctly
- **@medium**: Secondary features
- **@smoke**: Quick validation tests for CI/CD

### Assumptions Made During Testing

1. **Application Availability**
   - Google.com is accessible and operational
   - No regional restrictions or blocks on Google access
   - Internet connection is stable during test execution

2. **Browser Compatibility**
   - Tests are designed for latest versions of Chromium, Firefox, and WebKit
   - JavaScript is enabled in browsers
   - Cookies are allowed (handled by test setup)

3. **Test Data**
   - Search queries used will return results (based on popular tech terms)
   - Result order may vary but results will be present
   - External destination sites may have varying load times

4. **User Interface**
   - Google's UI structure remains relatively stable
   - Locators (textarea[name="q"], #search) are current as of implementation
   - Cookie consent dialogs handled gracefully if present

5. **Test Environment**
   - Tests run in isolated browser contexts (no shared state)
   - Each test starts from clean state
   - No authentication required for basic Google search

6. **Network Conditions**
   - Reasonable network latency (tests have 30s timeouts)
   - No proxy or firewall blocking Google access
   - DNS resolution works correctly

7. **Limitations Acknowledged**
   - Search result content may change over time
   - External sites (navigation targets) availability not guaranteed
   - Geolocation-based results may vary
   - CAPTCHA may appear (not handled in current implementation)

---

## 🏗️ Project Architecture

### Directory Structure

```
google-playwright-tests/
├── config/
│   └── env.config.ts           # Environment configuration
├── fixtures/
│   └── page-fixtures.ts        # Custom Playwright fixtures
├── page-object/
│   ├── base-page.ts            # Base class with common methods
│   └── google-page.ts          # Google-specific page object
├── test-data/
│   └── search-queries.ts       # Test data management
├── tests/
│   ├── google-search.spec.ts   # Main test suite with tags
│   ├── google.spec.ts          # Additional examples
│   └── example.spec.ts         # Playwright examples
├── playwright.config.ts        # Playwright configuration
├── package.json                # Dependencies and test scripts
├── env.example                 # Example environment configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file (complete documentation)
```

### Page Object Model (POM)

#### BasePage (`page-object/base-page.ts`)
Foundation class providing reusable methods:
- **Navigation**: `navigateTo()`, `waitForPageLoad()`, `goBack()`
- **Element Interaction**: `clickElement()`, `fillInput()`, `pressKey()`
- **Waiting Strategies**: `waitForElement()`, `waitForUrlContains()`, `isElementVisible()`
- **Information Retrieval**: `getPageTitle()`, `getCurrentUrl()`, `getElementText()`
- **Utilities**: `takeScreenshot()`, `scrollToElement()`, `getElementCount()`

#### GooglePage (`page-object/google-page.ts`)
Extends BasePage with Google-specific functionality:
- **Locators as Getters** (best practice):
  ```typescript
  get searchInput(): Locator { return this.page.locator('textarea[name="q"]'); }
  get searchResults(): Locator { return this.page.locator('#search'); }
  get searchResultLinks(): Locator { return this.page.locator('#search h3'); }
  ```
- **Action Methods**: `search()`, `searchWithButton()`, `clickFirstSearchResult()`
- **Verification Methods**: `isOnGoogleHomePage()`, `isOnSearchResultsPage()`
- **Helper Methods**: `acceptCookiesIfPresent()`, `getAllSearchResultTitles()`

### Custom Fixtures (`fixtures/page-fixtures.ts`)
Automatic page object initialization using Playwright's fixture system:
```typescript
test('test name', async ({ googlePage }) => {
    // googlePage is automatically initialized
    await googlePage.navigate();
});
```

### Test Data Management (`test-data/search-queries.ts`)
Centralized, structured test data:
```typescript
export interface SearchTestData {
    query: string;
    description: string;
    expectedResultsContain?: string;
}
```

---

## 📝 Test Cases

### Test Suite 1: Valid Search Tests
**Objective**: Verify Google search functionality returns appropriate results  
**Tag**: `@search`

#### TC-GS-001: Valid Search - Basic Keyword
- **Priority**: High
- **Tags**: `@search`, `@smoke`, `@high`
- **Description**: Verify that a valid search query returns search results with relevant content
- **Preconditions**: User is on Google homepage
- **Test Data**: "Playwright automation"
- **Steps**:
  1. Navigate to Google homepage
  2. Accept cookies if dialog appears
  3. Enter search query in search input field
  4. Press Enter to submit search
  5. Wait for search results to load
  6. Verify search results container is visible
  7. Verify result count is greater than 0
  8. Verify URL contains '/search' and query parameter
  9. Verify page title reflects the search
  10. Verify on search results page
- **Expected Results**:
  - Search results page displayed successfully
  - Multiple search results visible (count > 0)
  - URL contains '/search' and query parameter 'q='
  - Page title contains the search query
  - Result stats are visible
- **Soft Assertions**: Yes (test continues even if some assertions fail)
- **Actual Implementation**: Fully automated in `tests/google-search.spec.ts`

#### TC-GS-002: Valid Search - Using Button
- **Priority**: High
- **Tags**: `@search`, `@high`
- **Description**: Verify search can be performed using the search button (not just Enter key)
- **Test Data**: "TypeScript testing framework"
- **Steps**:
  1. Navigate to homepage
  2. Enter search query
  3. Click the "Google Search" button
  4. Verify results are displayed
- **Expected Results**:
  - Search executes successfully via button click
  - Results page loads with relevant content
  - Result count > 0

#### TC-GS-003: Result Content Verification
- **Priority**: High
- **Tags**: `@search`, `@high`
- **Description**: Verify search results contain relevant content related to the query
- **Steps**:
  1. Perform search with specific keyword
  2. Retrieve all search result titles
  3. Verify at least one result contains expected keyword
  4. Verify first result has non-empty text
- **Expected Results**:
  - Results are relevant to the search query
  - Result titles contain expected keywords
  - Multiple results displayed

#### TC-GS-004: Multiple Keywords Search
- **Priority**: Medium
- **Tags**: `@search`, `@medium`
- **Description**: Verify search works correctly with multiple keywords
- **Test Data**: "Playwright TypeScript testing"
- **Expected Results**:
  - Multi-keyword search handled correctly
  - Results relevant to combined search terms

#### TC-GS-005: Search Input Validation
- **Priority**: High
- **Tags**: `@search`, `@smoke`, `@high`
- **Description**: Verify search input field is functional
- **Steps**:
  1. Check input visibility
  2. Check input is enabled
  3. Test text can be entered
- **Expected Results**:
  - Input visible and enabled
  - Text can be entered successfully

---

### Test Suite 2: Navigation Tests
**Objective**: Verify navigation to search results works correctly  
**Tag**: `@navigation`

#### TC-GN-001: Navigate to First Search Result
- **Priority**: Critical
- **Tags**: `@navigation`, `@smoke`, `@critical`
- **Description**: Verify clicking the first search result navigates to correct destination
- **Preconditions**: Search has been performed and results are displayed
- **Test Data**: "Playwright documentation"
- **Steps**:
  1. Perform a valid search
  2. Wait for search results to load completely
  3. Get the URL of the first search result
  4. Verify URL is not empty and properly formatted
  5. Click on the first search result link
  6. Wait for navigation to complete
  7. Verify current URL is different from Google search page
  8. Verify user is no longer on Google search results
  9. Verify destination page has loaded successfully
  10. Verify destination page has content
- **Expected Results**:
  - User is redirected to the selected search result
  - Current URL does not contain 'google.com/search'
  - Destination page title is not empty
  - Page content has loaded (size > 1000 bytes)
- **Soft Assertions**: Yes
- **Known Limitations**: External site availability may vary

#### TC-GN-002: Navigate to Specific Search Result
- **Priority**: High
- **Tags**: `@navigation`, `@high`
- **Description**: Verify clicking any search result (not just first) navigates correctly
- **Test Data**: "GitHub Playwright"
- **Result Index**: 1 (second result)
- **Steps**:
  1. Perform search
  2. Verify multiple results available (at least 2)
  3. Click on second search result
  4. Verify navigation occurred
  5. Verify destination page loaded
- **Expected Results**:
  - Navigation to selected result successful
  - User reaches destination page
  - Page loads completely

#### TC-GN-003: Verify Result URLs
- **Priority**: Medium
- **Tags**: `@navigation`, `@medium`
- **Description**: Validate search results have valid URLs before navigation
- **Steps**:
  1. Perform search
  2. Get URLs from first 3 results
  3. Verify each URL is valid and not empty
  4. Verify URLs start with http/https
  5. Verify URLs are unique
- **Expected Results**:
  - All results have non-empty URLs
  - URLs properly formatted
  - Different results have different URLs

#### TC-GN-004: Complete Search and Navigation Flow
- **Priority**: Critical
- **Tags**: `@navigation`, `@e2e`, `@critical`
- **Description**: End-to-end flow validation from homepage to destination
- **Test Type**: Integration/E2E test
- **Steps**:
  1. Start at Google homepage
  2. Perform search
  3. Verify search results page
  4. Get first result information
  5. Navigate to first result
  6. Verify destination page
- **Expected Results**:
  - Complete flow executes without errors
  - All intermediate steps verified
  - Destination page accessible

---

## ⚙️ Configuration

### Playwright Configuration (`playwright.config.ts`)
- **Test Directory**: `./tests`
- **Browsers**: Chromium, Firefox, WebKit
- **Parallel Execution**: Enabled (faster test runs)
- **Retries**: 1 (local), 2 (CI environment)
- **Timeouts**: 
  - Global: 30000ms
  - Expect: 10000ms
  - Navigation: 30000ms
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Collected on retry/failure
- **Reports**: HTML, List, JSON formats

### Environment Configuration

Configuration can be customized via `.env` file (use `env.example` as template):

```env
# Application
BASE_URL=https://www.google.com
TEST_ENV=production

# Browser
HEADLESS=true
SLOWMO=0

# Timeouts (milliseconds)
DEFAULT_TIMEOUT=30000
NAVIGATION_TIMEOUT=30000

# Reporting
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true

# Test Data
DEFAULT_SEARCH_QUERY=Playwright automation
```

These settings are loaded in `config/env.config.ts` and used throughout the test suite.

---

## 🔧 Troubleshooting

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| **Browsers not installed** | Run `npx playwright install` |
| **Tests failing unexpectedly** | Run `npm run test:headed` to see browser actions |
| **Need to debug a test** | Run `npm run test:debug` for step-by-step execution |
| **Slow network/timeouts** | Increase timeouts in `.env` file (copy from `env.example`) |
| **Element not found** | Check locators in page objects, Google UI may have changed |
| **Cookie consent blocking tests** | Already handled in `beforeEach` hook |
| **npm install fails** | Check Node.js version (need 18+), try `npm cache clean --force` |
| **Configuration not working** | Ensure you copied `env.example` to `.env` |

### Debug Commands

```bash
# See browser during test execution
npm run test:headed

# Step through tests interactively with debugging
npm run test:debug

# Interactive test UI with visual test runner
npm run test:ui

# Run single test by test ID
npm test -- --grep="TC-GS-001"

# Run tests with specific tag
npm test -- --grep="@smoke"

# Show detailed browser console logs
PWDEBUG=console npm test

# Generate trace for debugging
npx playwright show-trace test-results/.../trace.zip
```

### Viewing Test Results

#### 1. HTML Report (Recommended)
```bash
npm run report
```
Features:
- Interactive test results browser
- Screenshots embedded
- Video playback
- Trace viewer for step-by-step debugging
- Filterable by status (passed/failed)

#### 2. Console Output
- Real-time output during test execution
- List format showing pass/fail status
- Execution time for each test

#### 3. JSON Report
- Location: `test-results/test-results.json`
- Machine-readable format
- Ideal for CI/CD integration
- Can be processed by external tools

### Getting Help

If you encounter issues:
1. Check the [Playwright Documentation](https://playwright.dev)
2. Review test execution logs in console
3. Check HTML report for detailed failure information
4. Run in debug mode to step through tests
5. Verify all prerequisites are met

---

## 💡 Best Practices Implemented

### ISTQB Principles
✅ Test independence and isolation  
✅ Repeatable and consistent results  
✅ Clear defect reporting  
✅ Maintainable test code  
✅ Traceability with test IDs  
✅ Risk-based prioritization  

### Playwright Best Practices
✅ Custom fixtures for page objects  
✅ Auto-waiting (no explicit waits unless necessary)  
✅ Soft assertions for comprehensive feedback  
✅ Test steps for better reporting  
✅ Parallel execution for speed  
✅ Comprehensive reporting  

### TypeScript Best Practices
✅ Strong typing throughout  
✅ Interface definitions for contracts  
✅ JSDoc comments for documentation  
✅ Proper async/await usage  
✅ Error handling where needed  

### Test Automation Best Practices
✅ Page Object Model for maintainability  
✅ Getters for locators (fresh evaluation)  
✅ DRY principle (Don't Repeat Yourself)  
✅ Clear, descriptive naming  
✅ Separation of concerns  
✅ Data-driven testing approach  

---

## 📄 Additional Information

### Test Execution Summary Example

```bash
npm test

Running 9 tests using 3 workers

  ✓ [chromium] › google-search.spec.ts:TC-GS-001 › Valid Search (3.2s)
  ✓ [chromium] › google-search.spec.ts:TC-GS-002 › Search Button (2.8s)
  ✓ [chromium] › google-search.spec.ts:TC-GS-003 › Result Content (3.1s)
  ✓ [chromium] › google-search.spec.ts:TC-GS-004 › Multiple Keywords (2.9s)
  ✓ [chromium] › google-search.spec.ts:TC-GS-005 › Search Input (2.3s)
  ✓ [chromium] › google-search.spec.ts:TC-GN-001 › Navigate First (4.5s)
  ✓ [chromium] › google-search.spec.ts:TC-GN-002 › Navigate Specific (4.2s)
  ✓ [chromium] › google-search.spec.ts:TC-GN-003 › Verify URLs (3.7s)
  ✓ [chromium] › google-search.spec.ts:TC-GN-004 › Complete Flow (5.1s)

  9 passed (31.8s)
```

### Project Maintenance

- **Update Dependencies**: Run `npm update` periodically
- **Update Browsers**: Run `npx playwright install` after Playwright updates
- **Review Locators**: Check page object selectors if Google UI changes
- **Update Test Data**: Refresh search queries if results become stale
- **Environment Config**: Review `env.example` for new configuration options after updates

### CI/CD Integration

This project is CI/CD ready:
- Set `CI=true` environment variable
- Tests will run headlessly with retries
- JSON reports generated for pipeline integration
- Screenshots and videos captured for failed tests

---

## 📄 License

ISC

---

**Built with ❤️ using Playwright and TypeScript**

For questions or issues, please refer to the troubleshooting section or Playwright documentation.
