import {Locator, Page, expect} from "@playwright/test";
import {BasePage} from "./basePage";

export class CategoryProductsPage extends BasePage {
    private womenTitle: Locator
    private readonly expectedWomenTitleText = 'Women - Dress Products'

    private menCategoryButton: Locator
    private menCategoryJeansSubcategoryButton: Locator

    private menTitle: Locator
    private readonly expectedMenTitleText = 'Men - Jeans Products'

    constructor(page: Page) {
        super(page)
        this.womenTitle = page.locator('div[class="features_items"] h2').nth(0)
        this.menCategoryButton = page.locator('i[class="fa fa-plus"]').nth(1)
        this.menCategoryJeansSubcategoryButton = page.locator('div[class="panel-body"] li a').nth(4)
        this.menTitle = page.locator('div[class="features_items"] h2').nth(0)
    }

    async verifyMenTitleMatchesText() {
        await expect(this.menTitle).toHaveText(this.expectedMenTitleText)
    }

    async clickOnMenCategoryJeansButton() {
        await this.menCategoryButton.click()
        await this.menCategoryJeansSubcategoryButton.click()
    }

    async verifyWomenTitleMatchesText() {
        await expect(this.womenTitle).toHaveText(this.expectedWomenTitleText)
    }
}