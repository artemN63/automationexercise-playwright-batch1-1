import {test} from '@playwright/test';
import {HomePage} from '../../pages/homePage';
import { LoginSignUpPage } from '../../pages/loginSignUpPage';
import { faker } from '@faker-js/faker';

test.describe('Login with invalid credentials', () => {
    let homePage: HomePage;
    let loginSignUpPage: LoginSignUpPage;

    test.beforeEach(async ({page}) => {
        homePage = new HomePage(page);
        loginSignUpPage = new LoginSignUpPage(page);
        await page.goto(process.env.baseUrl!);
    });

    test('should display error message for invalid credentials', async () => {
        await homePage.verifyHomePage()
        await homePage.clickOnNavLink('Signup / Login');
        await loginSignUpPage.validateLoginTitle()
        await loginSignUpPage.loginWithEmailAndPassword(faker.internet.email(), faker.internet.password());
        await loginSignUpPage.verifyErrorMessageForInvalidLogin()
    });

    test('login with valid credentials', async () => {
        await homePage.verifyHomePage()
        await homePage.clickOnNavLink('Signup / Login');
        await loginSignUpPage.validateLoginTitle()
        await loginSignUpPage.loginWithEmailAndPassword(process.env.email!, process.env.password!);
        await homePage.validateLoggedInAsUser('apologyaccount@gmail.com')
        await homePage.clickOnNavLink('Delete Account');
        await homePage.verifyAccountDeleted()
    });
});
