import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class SignUpPage extends BasePage {

    private enterAccountInformationText: Locator;
    private mrRadio: Locator;
    private mrsRadio: Locator;
    private passwordField: Locator;
    private daysSelect: Locator;
    private monthsSelect: Locator
    private yearsSelect: Locator;
    private newsletterCheckbox: Locator;
    private specialOffersCheckbox: Locator
    private firstNameField: Locator;
    private lastNameField: Locator;
    private companyField: Locator;
    private address1Field: Locator;
    private address2Field: Locator;
    private cityField: Locator;
    private zipcodeField: Locator;
    private mobileNumberField: Locator
    private countryField: Locator;
    private stateField: Locator
    private createAccountButton: Locator;

    constructor(page: Page) {
        super(page);
        this.enterAccountInformationText = page.getByText('Enter Account Information')
        this.mrRadio = page.getByRole('radio', { name: 'Mr.' })
        this.mrsRadio = page.getByRole('radio', { name: 'Mrs.' })
        this.passwordField = page.getByRole('textbox', { name: 'Password *' })
        this.daysSelect = page.locator('#days')
        this.monthsSelect = page.locator('#months')
        this.yearsSelect = page.locator('#years')
        this.newsletterCheckbox = page.getByRole('checkbox', { name: 'Sign up for our newsletter!' })
        this.specialOffersCheckbox = page.getByRole('checkbox', { name: 'Receive special offers from' })
        this.firstNameField = page.getByRole('textbox', { name: 'First name *' })
        this.lastNameField = page.getByRole('textbox', { name: 'Last name *' })
        this.companyField = page.getByRole('textbox', { name: 'Company', exact: true })
        this.address1Field = page.getByRole('textbox', { name: 'Address * (Street address, P.' })
        this.address2Field = page.getByRole('textbox', { name: 'Address 2' })
        this.countryField = page.getByLabel('Country *')
        this.stateField = page.getByRole('textbox', { name: 'State *' })
        this.cityField = page.getByRole('textbox', { name: 'City * Zipcode *' })
        this.zipcodeField = page.locator('#zipcode')
        this.mobileNumberField = page.getByRole('textbox', { name: 'Mobile Number *' })
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' })
    }

    async verifyEnterAccountInformationText(): Promise<void> {
        await this.enterAccountInformationText.isVisible()
        await expect(this.enterAccountInformationText).toHaveText('Enter Account Information')
    }

    async fillAccountDetails(mrOrMrs: string, password: string, day: string, month: string, year: string): Promise<void> {
        // MR, Mr, mr
        if (mrOrMrs.toLowerCase() === 'mr') {
            await this.mrRadio.check()
        } else if (mrOrMrs.toLowerCase() === 'mrs') {
            await this.mrsRadio.check()
        } else {
            throw new Error(`Invalid title: ${mrOrMrs}. Please use 'Mr' or 'Mrs'.`)
        }

        await this.passwordField.fill(password)
        await this.daysSelect.selectOption(day)
        await this.monthsSelect.selectOption(month)
        await this.yearsSelect.selectOption(year)
    }

    async checkNewsletterCheckbox(): Promise<void> {
        await this.newsletterCheckbox.check()
    }

    async uncheckNewsletterCheckbox(): Promise<void> {
        await this.newsletterCheckbox.uncheck()
    }

    async checkSpecialOffersCheckbox(): Promise<void> {
        await this.specialOffersCheckbox.check()
    }

    async uncheckSpecialOffersCheckbox(): Promise<void> {
        await this.specialOffersCheckbox.uncheck()
    }

    async fillAddressDetails(
        firstName: string,
        lastName: string,
        company: string,
        address1: string,
        address2: string,
        country: string,
        state: string,
        city: string,
        zipcode: string,
        mobileNumber: string
    ): Promise<void> {
        await this.firstNameField.fill(firstName)
        await this.lastNameField.fill(lastName)
        await this.companyField.fill(company)
        await this.address1Field.fill(address1)
        await this.address2Field.fill(address2)
        await this.countryField.selectOption(country)
        await this.stateField.fill(state)
        await this.cityField.fill(city)
        await this.zipcodeField.fill(zipcode)
        await this.mobileNumberField.fill(mobileNumber)
    }

    async clickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click()
    }

}