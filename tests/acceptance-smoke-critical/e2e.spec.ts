import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { LoginSignUpPage } from '../../pages/loginSignUpPage';
import { faker } from '@faker-js/faker'

test.describe('End to end test cases ', async () => {
    let homePage: HomePage // creating an empty variable
    let loginSignUpPage: LoginSignUpPage // creating an empty variable

    test.beforeEach('Setting up preconditions', async ({ page }) => {
        loginSignUpPage = new LoginSignUpPage(page) // giving value to empty variable
        homePage = new HomePage(page)               // giving value to empty variable
        // ! in the end asserts it's not null or undefined
        await page.goto(process.env.baseUrl!)
    })

    test('End to end account create and delete flow', async ({ page }) => {
        /**
            1. Launch browser+
            2. Navigate to url 'http://automationexercise.com'+
            3. Verify that home page is visible successfully + 
            4. Click on 'Signup / Login' button+
            5. Verify 'New User Signup!' is visible+
            6. Enter name and email address 
            7. Click 'Signup' button
            8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
            9. Fill details: Title, Name, Email, Password, Date of birth
            10. Select checkbox 'Sign up for our newsletter!'
            11. Select checkbox 'Receive special offers from our partners!'
            12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
            13. Click 'Create Account button'
            14. Verify that 'ACCOUNT CREATED!' is visible
            15. Click 'Continue' button
            16. Verify that 'Logged in as username' is visible
            17. Click 'Delete Account' button
            18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
         */
        // Generate random test data using faker


        await homePage.verifyHomePage()
        // await homePage.clickOnNavLink('Signup / Login')
        await loginSignUpPage.clickOnNavLink('Signup / Login')
        await loginSignUpPage.validateSignUpTitle()

        const fullName = faker.person.fullName()
        const email = faker.internet.email()

        await loginSignUpPage.signUpWithNameAndEmail(fullName, email)
        await page.waitForTimeout(30_000)
    })

    test('Test show for faker', async ({ page }) => {

        console.log(faker.person.fullName())
        console.log(faker.internet.email())
        console.log(faker.phone.number())
        console.log(faker.location.city())
        console.log(faker.location.country())
    })

})
