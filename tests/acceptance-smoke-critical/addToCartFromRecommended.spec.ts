import {test} from '@playwright/test';
import { HomePage } from '../../pages/homePage';

test.describe('Product Add to Cart', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await page.goto(process.env.baseUrl!);
        await homePage.verifyHomePage();
    });

    test('Verify Product added to Cart from Recommended Section', async () => {
        await homePage.scrollToRecommendedSection();
        await homePage.verifyRecommendedItemsSection();
        await homePage.clickAddToCartFromRecommendedButtonAndVerifyProduct();
    });
});