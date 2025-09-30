import {expect, Locator, Page} from "@playwright/test";
import {BasePage} from "./basePage";

export class TestCasesPage extends BasePage {
    private testCasesTitle: Locator;
    private readonly expectedTitleText = 'Test Cases';

    constructor(page: Page) {
        super(page);
        this.testCasesTitle = page.locator('h2[class="title text-center"]');
    }

    async verifyTestCasesPage() {
        await expect(this.testCasesTitle).toHaveText(this.expectedTitleText);
    }
}