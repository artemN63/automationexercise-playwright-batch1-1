import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { LoginSignUpPage } from '../../pages/loginSignUpPage';
import { faker } from '@faker-js/faker'
import { SignUpPage } from '../../pages/signUpPage';
import { AccountCreatedPage } from '../../pages/accountCreatedPage';
import { AccountDeletedPage } from '../../pages/accountDeletedPage';

test.describe('End to end test cases ', async () => {
    let homePage: HomePage // creating an empty variable
    let loginSignUpPage: LoginSignUpPage // creating an empty variable
    let signUpPage: SignUpPage // creating an empty variable
    let accountCreatedPage: AccountCreatedPage // creating an empty variable
    let accountDeletedPage: AccountDeletedPage // creating an empty variable

    test.beforeEach('Setting up preconditions', async ({ page }) => {
        loginSignUpPage = new LoginSignUpPage(page) // giving value to empty variable
        homePage = new HomePage(page)               // giving value to empty variable
        signUpPage = new SignUpPage(page)           // giving value to empty variable
        accountCreatedPage = new AccountCreatedPage(page) // giving value to empty variable
        accountDeletedPage = new AccountDeletedPage(page) // giving value to empty variable
        // ! in the end asserts it's not null or undefined
        await page.goto(process.env.baseUrl!)
    })

    test('End to end account create and delete flow', async ({ page }) => {
        await homePage.verifyHomePage()
        await loginSignUpPage.clickOnNavLink('Signup / Login')
        await loginSignUpPage.validateSignUpTitle()

        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const fullName = firstName + ' ' + lastName
        const email = faker.internet.email()
        const password = faker.internet.password()
        const address1 = faker.location.streetAddress()
        const address2 = faker.location.secondaryAddress()
        const city = faker.location.city()
        const state = faker.location.state()
        const zipCode = faker.location.zipCode()
        const country = faker.location.country()
        const mobileNumber = faker.phone.number()
        const company = faker.company.name()

        await loginSignUpPage.signUpWithNameAndEmail(fullName, email)
        await signUpPage.verifyEnterAccountInformationText()
        await signUpPage.fillAccountDetails('Mrs', password, '10', '5', '1990')
        await signUpPage.checkNewsletterCheckbox()
        await signUpPage.checkSpecialOffersCheckbox()
        await signUpPage.fillAddressDetails(
            firstName,
            lastName,
            company,
            address1,
            address2,
            'United States',
            state,
            city,
            zipCode,
            mobileNumber
        )
        await signUpPage.clickCreateAccountButton()
        await accountCreatedPage.verifyAccountCreatedText()
        await accountCreatedPage.clickContinueButton()
        await homePage.verifyLoggedInAsUserName(fullName)
        await homePage.clickOnNavLink('Delete Account')
        await accountDeletedPage.verifyAccountDeletedText()
        await accountDeletedPage.clickContinueButton()

    })

    test('Test show for faker', async ({ page }) => {

        console.log(faker.person.fullName())
        console.log(faker.internet.email())
        console.log(faker.phone.number())
        console.log(faker.location.city())
        console.log(faker.location.country())
    })

})
