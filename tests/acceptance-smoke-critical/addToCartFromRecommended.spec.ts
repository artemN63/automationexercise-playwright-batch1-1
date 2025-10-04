import {test} from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { CartPage } from '../../pages/cartPage';

test.describe('Product Add to Cart', () => {
    let homePage: HomePage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        cartPage = new CartPage(page);
        await page.goto(process.env.baseUrl!);
        await homePage.verifyHomePage();
    });

    test('Verify Product added to Cart from Recommended Section', async () => {
        await homePage.scrollToRecommendedSection();
        await homePage.verifyRecommendedItemsSection();
    });
});