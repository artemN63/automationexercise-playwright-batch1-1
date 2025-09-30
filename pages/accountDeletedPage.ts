import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class AccountDeletedPage extends BasePage {
    private accountDeletedText: Locator;
    private continueButton: Locator;

    constructor(page: Page) {
        super(page);
        this.accountDeletedText = page.locator('h2[data-qa="account-deleted"]');
        this.continueButton = page.getByText('Continue');
    }
    async verifyAccountDeletedText(): Promise<void> {
        await this.accountDeletedText.isVisible();
        await this.accountDeletedText.textContent() === 'Account Deleted!';
    }
    async clickContinueButton(): Promise<void> {
        await this.continueButton.click();
    }
}