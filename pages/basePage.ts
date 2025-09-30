import { Locator, Page } from "@playwright/test";

export class BasePage {
    page: Page;
    private topNavigationLocators: Locator

    constructor(page: Page) {
        this.page = page
        this.topNavigationLocators = page.locator(`ul[class="nav navbar-nav"] li`) // all nav locators
    }

    async clickOnNavLink(linkText: string) {
        await this.topNavigationLocators.getByText(linkText).click()
    }
}