import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";

export class HomePage extends BasePage {
    private logo: Locator

    constructor(page: Page) {
        super(page)
        this.logo = page.getByRole('link', { name: 'Website for automation' })
    }

    async verifyHomePage() {
        await expect(this.logo).toBeVisible()
    }
}