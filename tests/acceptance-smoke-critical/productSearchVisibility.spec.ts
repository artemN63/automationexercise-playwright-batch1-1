import {test } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { SearchPage } from '../../pages/searchPage';

test.describe('Product Search Visibility', () => {
    let homePage: HomePage;
    let searchPage: SearchPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        searchPage = new SearchPage(page);
        await page.goto(process.env.baseUrl!);
    });

    test('Should display all products when search item', async () => {
        await homePage.verifyHomePage();
        await homePage.clickOnNavLink('Products');
        await searchPage.verifyAllProductsTitle();
        await searchPage.searchForProduct();
        await searchPage.verifySearchedProductsTitle();
        await searchPage.verifyProductsAreVisible();
    });

    test('Should display all products and product detail', async () => {
        await homePage.verifyHomePage();
        await homePage.clickOnNavLink('Products');
        await searchPage.verifyAllProductsTitle();
        await searchPage.verifyProductsAreVisible()
        await searchPage.clickOnViewProductButton()
        await searchPage.verifyDetailsAreVisible()
    });
});