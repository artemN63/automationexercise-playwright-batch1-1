import {Locator, Page, expect} from '@playwright/test'
import {BasePage} from "./basePage";

export class ProductDetailsPage extends BasePage {
    private quantityInput: Locator
    private addToCartButton: Locator
    private viewCartButton: Locator

    private nameOfProduct: Locator
    private actualNameOfProduct: Locator

    constructor(page: Page) {
        super(page)
        this.quantityInput = page.locator('input[id="quantity"]')
        this.addToCartButton = page.locator('button[class="btn btn-default cart"]')
        this.viewCartButton = page.locator('p[class="text-center"] a')

        this.nameOfProduct = page.locator('div[class="product-information"] h2')
        this.actualNameOfProduct = page.locator('td[class="cart_description"] h4 a')
    }

    async changeQuantity(quantity: string): Promise<void> {
        await this.quantityInput.fill(quantity)
    }

    async clickAddToCart(): Promise<void> {
        await this.addToCartButton.click()
    }

    async clickViewCartButton(): Promise<void> {
        await this.viewCartButton.click()
    }

    async verifyQuantity(quantity: string): Promise<void> {
        await expect(this.quantityInput).toBe(quantity)
    }
}