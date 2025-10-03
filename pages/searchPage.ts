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

    private viewProductButton: Locator

    private productName: Locator
    private productCategory: Locator
    private productPrice: Locator
    private productAvailability: Locator
    private productCondition: Locator
    private productBrand: Locator

    private brands: Locator
    private brandsTitle: Locator
    private readonly expectedBrandsTitle: string = 'Brands'

    private brandTitle: Locator

    private addToCartButton: Locator
    private continueShoppingButton: Locator

    private productInCart: Locator

    constructor(page: Page) {
        super(page);
        this.searchBar = page.locator('input[name="search"]');
        this.searchButton = page.locator('button[type="button"]');

        this.allProductsTitle = page.locator('h2[class="title text-center"]');

        this.searchedProductsTitle = page.locator('h2[class="title text-center"]');

        this.allProducts = page.locator('div[class="features_items"] div[class="single-products"]');

        this.viewProductButton = page.getByText('View Product');

        this.productName = page.locator('div[class="product-information"] h2');
        this.productCategory = page.locator('div[class="product-information"] p').nth(0);
        this.productPrice = page.locator('div[class="product-information"] span span');
        this.productAvailability = page.locator('div[class="product-information"] p').nth(1)
        this.productCondition = page.locator('div[class="product-information"] p').nth(2)
        this.productBrand = page.locator('div[class="product-information"] p').nth(3)

        this.brands = page.locator('div[class="brands-name"] ul li');
        this.brandsTitle = page.locator('div[class="brands_products"] h2')

        this.brandTitle = page.locator('h2[class="title text-center"]')

        this.addToCartButton = page.locator('div[class="productinfo text-center"] a[class="btn btn-default add-to-cart"] i')
        this.continueShoppingButton = page.getByText('Continue Shopping');

        this.productInCart = page.locator('td[class="cart_product"]');
    }

    async verifyProductsInCart() {
        const productsCount = await this.addToCartButton.count()

        for(let i = 0; i < productsCount; i++) {
            await expect(this.productInCart.nth(i)).toBeVisible()
        }
    }

    async clickAddToCartButton() {
        const productsCount = await this.addToCartButton.count()

        for(let i = 0; i < productsCount; i++) {
            await this.addToCartButton.nth(i).click()
            await this.continueShoppingButton.click()
        }
    }

    async brandsAreVisible() {
        await expect(this.brandsTitle).toHaveText(this.expectedBrandsTitle)
    }

    async randomBrandClickerAndVerification() {
        const brandsCount = await this.brands.count()
        const randomBrandByNumber = faker.number.int({min: 1, max: brandsCount})

        const brandName = (await this.brands.nth(randomBrandByNumber - 1).innerText()).toLowerCase().slice(4)
        await this.brands.nth(randomBrandByNumber - 1).click()

        await expect((await this.brandTitle.innerText()).toLowerCase()).toContain(brandName)
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
        for (let i = 0; i < productCount; i++) {
            await expect(this.allProducts.nth(i)).toBeVisible();
        }
    }

    async clickOnViewProductButton() {
        await this.viewProductButton.nth(0).click();
    }

    async verifyDetailsAreVisible() {
        await expect(this.productName).toBeVisible();
        await expect(this.productCategory).toBeVisible();
        await expect(this.productPrice).toBeVisible();
        await expect(this.productAvailability).toBeVisible();
        await expect(this.productCondition).toBeVisible();
        await expect(this.productBrand).toBeVisible();
    }
}