import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";

export class LoginSignUpPage extends BasePage {

    private signUpTitle: Locator
    private nameField: Locator
    private emailField: Locator
    private signupButton: Locator
    private readonly expectedSignUpTitleText = 'New User Signup!'

    private loginTitle: Locator
    private readonly expectedLoginTitleText = 'Login to your account'

    private loginEmailField: Locator
    private loginPasswordField: Locator
    private loginButton: Locator

    private errorMessage: Locator
    private readonly expectedLoginErrorMessage = 'Your email or password is incorrect!'

    constructor(page: Page) {
        super(page)
        this.signUpTitle = page.getByRole('heading', { name: this.expectedSignUpTitleText })
        this.nameField = page.getByRole('textbox', { name: 'Name' })
        this.emailField = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address')
        this.signupButton = page.getByRole('button', { name: 'Signup' })
        this.loginTitle = page.getByRole('heading', { name: 'Login to your account' })
        this.loginEmailField = page.locator('input[data-qa="login-email"]')
        this.loginPasswordField = page.locator('input[data-qa="login-password"]')
        this.loginButton = page.locator('button[data-qa="login-button"]')
        this.errorMessage = page.locator('p[style="color: red;"]')
    }

    async verifyErrorMessageForInvalidLogin(): Promise<void> {
        expect(this.errorMessage).toBeVisible()
        expect(this.errorMessage).toHaveText(this.expectedLoginErrorMessage)
    }

    async loginWithEmailAndPassword(email: string, password: string): Promise<void> {
        await this.loginEmailField.fill(email)
        await this.loginPasswordField.fill(password)
        await this.loginButton.click()
    }

    async validateLoginTitle(): Promise<void> {
        expect(this.loginTitle).toBeVisible()
        expect(this.loginTitle).toHaveText(this.expectedLoginTitleText)
    }

    async validateSignUpTitle(): Promise<void> {
        expect(this.signUpTitle).toBeVisible()
        expect(this.signUpTitle).toHaveText(this.expectedSignUpTitleText)
    }

    async signUpWithNameAndEmail(name: string, email: string): Promise<void> {
        await this.nameField.fill(name)
        await this.emailField.fill(email)
        await this.signupButton.click()
    }
}