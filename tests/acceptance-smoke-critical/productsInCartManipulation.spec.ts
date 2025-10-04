import {test } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { SearchPage } from '../../pages/searchPage';
import { LoginSignUpPage } from '../../pages/loginSignUpPage';
import { ProductDetailsPage } from '../../pages/productDetails';
import { CartPage } from '../../pages/cartPage';

test.describe('Product Search Visibility', () => {
    let homePage: HomePage;
    let searchPage: SearchPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        searchPage = new SearchPage(page);
        cartPage = new CartPage(page);
        await page.goto(process.env.baseUrl!);
        await homePage.verifyHomePage();
    });

    test('Verify Product quantity in Cart', async () => {
        await homePage.clickAddToCartButton(10);
        await homePage.clickOnNavLink('Cart')
        await cartPage.verifyCartUrl()
        await cartPage.clickAllDeleteButtons()
        await cartPage.verifyCartIsEmptyMessage()
    });
});