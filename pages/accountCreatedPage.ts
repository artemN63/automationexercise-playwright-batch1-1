import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class AccountCreatedPage extends BasePage {

    private accountCreatedText: Locator;
    private continueButton: Locator;

    constructor(page: Page) {
        super(page);
        this.accountCreatedText = page.locator('h2[data-qa="account-created"]');
        this.continueButton = page.getByText('Continue');

    }

    async verifyAccountCreatedText(): Promise<void> {
        await this.accountCreatedText.isVisible();
        await expect(this.accountCreatedText).toHaveText('Account Created!');
    }

    async clickContinueButton(): Promise<void> {
        await this.continueButton.click();
    }

}