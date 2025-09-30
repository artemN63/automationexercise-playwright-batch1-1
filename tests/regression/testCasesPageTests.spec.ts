import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { TestCasesPage } from '../../pages/testCasesPage';

test.describe('End to end test cases ', async () => {
    let homePage: HomePage // creating an empty variable
    let testCasesPage: TestCasesPage // creating an empty variable

    test.beforeEach('Setting up preconditions', async ({ page }) => {
        homePage = new HomePage(page)               // giving value to empty variable
        testCasesPage = new TestCasesPage(page) // giving value to empty variable
        // ! in the end asserts it's not null or undefined
        await page.goto(process.env.baseUrl!)
    })

    test('Verify Test Cases Page', async ({ page }) => {
        await homePage.verifyHomePage()
        await homePage.clickOnNavLink('Test Cases')
        await testCasesPage.verifyTestCasesPage()
    })

})