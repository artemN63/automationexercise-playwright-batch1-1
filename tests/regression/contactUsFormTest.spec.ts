import {test} from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { Contact } from '../../pages/contactUsPage';

test.describe('Contact Us Form', () => {
    let homePage: HomePage;
    let contactPage: Contact;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        contactPage = new Contact(page);
        await page.goto(process.env.baseUrl!);
        await homePage.verifyHomePage();
    });

    test('Verify Contact Us Form Functionality', async () => {
        await homePage.clickOnNavLink('Contact us')
        await contactPage.verifyGetInTouchHeader();
        await contactPage.fillContactForm('TestFiles/ddd60wpj244e1.jpeg');
        //await contactPage.verifySuccessMessageAndGoHome();
        //await homePage.verifyHomePage();
    });
});