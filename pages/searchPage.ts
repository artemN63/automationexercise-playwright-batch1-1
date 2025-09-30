import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from "./basePage"
import { faker } from '@faker-js/faker';

export class SearchPage extends BasePage {
    private searchBar: Locator
    private searchButton: Locator

    private allProductsTitle: Locator
    private readonly expectedAllProductsTitleText = 'All Products'

    private searchedProductsTitle: Locator
    private readonly expectedSearchedProductsTitleText = 'Searched Products'

    private allProducts: Locator

    constructor(page: Page) {
        super(page);
        this.searchBar = page.locator('input[name="search"]');
        this.searchButton = page.locator('button[type="button"]');

        this.allProductsTitle = page.locator('h2[class="title text-center"]');

        this.searchedProductsTitle = page.locator('h2[class="title text-center"]');

        this.allProducts = page.locator('div[class="features_items"] div[class="single-products"]');
    }

    async verifyAllProductsTitle() {
        await expect(this.allProductsTitle).toHaveText(this.expectedAllProductsTitleText);
    }

    async verifySearchedProductsTitle() {
        await expect(this.searchedProductsTitle).toHaveText(this.expectedSearchedProductsTitleText);
    }

    async searchForProduct() {
        const clothingItems = ['shirt', 'dress', 'jeans', 'sweater', 'top'];
        const randomClothing = faker.helpers.arrayElement(clothingItems);
        await this.searchBar.fill(randomClothing);
        await this.searchButton.click();
    }

    async verifyProductsAreVisible() {
        // Wait for the products container to load
        await this.page.waitForSelector('div[class="features_items"]');
        
        // Get the count of products
        const productCount = await this.allProducts.count();
        
        // Verify that at least one product exists
        expect(productCount).toBeGreaterThan(0);
        
        // Verify that the first product is visible
        await expect(this.allProducts.first()).toBeVisible();
        
        // Optional: Verify multiple products are visible if they exist
        for (let i = 0; i < Math.min(productCount, 3); i++) {
            await expect(this.allProducts.nth(i)).toBeVisible();
        }
    }
}