import {test} from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { SearchPage } from '../../pages/searchPage';
import { CategoryProductsPage } from '../../pages/categoryProducts';

test.describe('Product Search Visibility', () => {
    let homePage: HomePage;
    let searchPage: SearchPage;
    let categoryProductsPage: CategoryProductsPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        searchPage = new SearchPage(page);
        categoryProductsPage = new CategoryProductsPage(page);
        await page.goto(process.env.baseUrl!);
    });

    test('View Category Products', async () => {
        await homePage.verifyCategoriesAreVisible()
        await homePage.clickOnWomenCategoryDressButton()
        await categoryProductsPage.verifyWomenTitleMatchesText()
        await categoryProductsPage.clickOnMenCategoryJeansButton()
        await categoryProductsPage.verifyMenTitleMatchesText()
    })
});