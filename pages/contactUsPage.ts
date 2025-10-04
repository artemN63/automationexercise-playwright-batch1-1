import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { faker } from '@faker-js/faker';

export class Contact extends BasePage {
    private getInTouchHeader: Locator
    private readonly expectedGetInTouchHeaderText = 'Get In Touch'

    private nameInput: Locator
    private emailInput: Locator
    private subjectInput: Locator
    private messageTextarea: Locator
    private uploadFileInput: Locator
    private submitButton: Locator

    private successMessage: Locator
    private readonly expectedSuccessMessageText = 'Success! Your details have been submitted successfully.'

    private homePageLink: Locator

    constructor(page: Page) {
        super(page)
        this.getInTouchHeader = page.getByRole('heading', { name: this.expectedGetInTouchHeaderText })

        this.nameInput = page.locator('input[data-qa="name"]')
        this.emailInput = page.locator('input[data-qa="email"]')
        this.subjectInput = page.locator('input[data-qa="subject"]')
        this.messageTextarea = page.locator('textarea[data-qa="message"]')
        this.uploadFileInput = page.locator('input[name="upload_file"]')
        this.submitButton = page.locator('input[data-qa="submit-button"]')

        this.successMessage = page.locator('div[class="status alert alert-success"]')

        this.homePageLink = page.getByRole('link', { name: 'Home' })
    }

    async verifySuccessMessageAndGoHome() {
        await expect(this.successMessage).toBeVisible()
        await expect(this.successMessage).toHaveText(this.expectedSuccessMessageText)

        await this.homePageLink.click()
    }

    async fillContactForm(filePath: string) {
        await this.nameInput.fill(faker.person.fullName())
        await this.emailInput.fill(faker.internet.email())
        await this.subjectInput.fill(faker.lorem.sentence())
        await this.messageTextarea.fill(faker.lorem.paragraph())
        await this.uploadFileInput.setInputFiles(filePath)
        await this.submitButton.click()

        await this.page.on('dialog', async dialog => {
            await dialog.accept();
        });
    }

    async verifyGetInTouchHeader() {
        await expect(this.getInTouchHeader).toBeVisible()
        await expect(this.getInTouchHeader).toHaveText(this.expectedGetInTouchHeaderText)
    }
}