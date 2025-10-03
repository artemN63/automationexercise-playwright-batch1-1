import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";

export class HomePage extends BasePage {
    private logo: Locator
    
    private categories: Locator
    private womenCategoryButton: Locator
    private dressSubcategoryButton: Locator

    private loggedInAsLocator: Locator
    private accountDeletedMessage: Locator
    private readonly expectedAccountDeletedMessageText = 'Account Deleted!'

    constructor(page: Page) {
        super(page)
        this.logo = page.getByRole('link', { name: 'Website for automation' })
        
        this.categories = page.locator('div[class="panel-group category-products"] h4');
        this.womenCategoryButton = page.locator('i[class="fa fa-plus"]').first()
        this.dressSubcategoryButton = page.locator('div[class="panel-body"] li a').first()

        this.loggedInAsLocator = page.locator('a').filter({ hasText: 'Logged in as' })
        this.accountDeletedMessage = page.locator('h2').filter({ hasText: this.expectedAccountDeletedMessageText })
    }

    async verifyAccountDeleted() {
        await expect(this.accountDeletedMessage).toBeVisible()
        await expect(this.accountDeletedMessage).toHaveText(this.expectedAccountDeletedMessageText)
    }

    async validateLoggedInAsUser(fullName: string) {
        await expect(this.loggedInAsLocator).toBeVisible()
        await expect(this.loggedInAsLocator).toHaveText(`Logged in as ${fullName}`)
    }

    async clickOnWomenCategoryDressButton() {
        await this.womenCategoryButton.click()
        await this.dressSubcategoryButton.click()
    }

    async verifyCategoriesAreVisible() {
        await expect(this.categories.first()).toBeVisible();
        await expect(this.categories.nth(1)).toBeVisible();
        await expect(this.categories.nth(2)).toBeVisible();
    }

    async verifyHomePage() {
        await expect(this.logo).toBeVisible()
    }

    async verifyLoggedInAsUserName(fullName: string) {
        const loggedInAsLocator = this.page.getByText(`Logged in as ${fullName}`)
        await expect(loggedInAsLocator).toBeVisible()
        await expect(loggedInAsLocator).toHaveText(`Logged in as ${fullName}`)
    }
}