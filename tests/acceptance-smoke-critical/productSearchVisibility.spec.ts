import {test } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { SearchPage } from '../../pages/searchPage';
import { LoginSignUpPage } from '../../pages/loginSignUpPage';

test.describe('Product Search Visibility', () => {
    let homePage: HomePage;
    let searchPage: SearchPage;
    let loginSignUpPage: LoginSignUpPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        searchPage = new SearchPage(page);
        loginSignUpPage = new LoginSignUpPage(page);
        await page.goto(process.env.baseUrl!);
        await homePage.verifyHomePage();
        await homePage.clickOnNavLink('Products');
        await searchPage.verifyAllProductsTitle();
    });

    test('Should display all products when search item', async () => {
        await searchPage.searchForProduct();
        await searchPage.verifySearchedProductsTitle();
        await searchPage.verifyProductsAreVisible();
    });

    test('Should display all products and product detail', async () => {
        await searchPage.verifyProductsAreVisible()
        await searchPage.clickOnViewProductButton()
        await searchPage.verifyDetailsAreVisible()
    });

    test('Should display all products when choose a brand', async () => {
        await searchPage.brandsAreVisible()
        await searchPage.randomBrandClickerAndVerification()
        await searchPage.verifyProductsAreVisible()
        await searchPage.randomBrandClickerAndVerification()
        await searchPage.verifyProductsAreVisible()
    });

    test('Search Products and Verify Cart After Login', async () => {
        await searchPage.searchForProduct()
        await searchPage.verifySearchedProductsTitle()
        await searchPage.verifyProductsAreVisible()
        await searchPage.clickAllAddToCartButton()
        await homePage.clickOnNavLink('Cart')
        await searchPage.verifyProductsInCart()
        await homePage.clickOnNavLink('Signup / Login')
        await loginSignUpPage.loginWithEmailAndPassword(process.env.email!, process.env.password!)
        await homePage.clickOnNavLink('Cart')
        await searchPage.verifyProductsInCart()
    });
});