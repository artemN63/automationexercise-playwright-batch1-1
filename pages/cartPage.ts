import {Locator, Page, expect} from '@playwright/test';
import {BasePage} from "./basePage";

export class CartPage extends BasePage {
    private readonly cartUrl = 'https://automationexercise.com/view_cart'

    private cartDeleteButton: Locator

    private cartIsEmptyMessage: Locator
    private readonly expectedCartIsEmptyMessageText = 'Cart is empty!'

    constructor(page: Page) {
        super(page)
        this.cartDeleteButton = page.locator('td[class="cart_delete"] a i')
        this.cartIsEmptyMessage = page.locator('p[class="text-center"] b')
    }

    async verifyCartIsEmptyMessage(): Promise<void> {
        await expect(this.cartIsEmptyMessage).toBeVisible()
        await expect(this.cartIsEmptyMessage).toHaveText(this.expectedCartIsEmptyMessageText)
    }

    async clickAllDeleteButtons(): Promise<void> {
        while (await this.cartDeleteButton.count() - 1 > 0) {
            await this.cartDeleteButton.first().click()
        }
    }

    async verifyCartUrl(): Promise<void> {
        await expect(this.page).toHaveURL(this.cartUrl)
    }
}