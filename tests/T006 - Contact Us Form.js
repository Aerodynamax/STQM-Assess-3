import { ClientFunction, Selector } from 'testcafe';

// T006 - Contact Us Form (F9)

fixture`T006 - Contact Us Form`
    .page`https://opencart.abstracta.us/index.php?route=information/contact`;

// Scenario 1: Submit a valid contact enquiry
test('Scenario 1 - Valid Enquiry Submission', async t => {
    const getURL = ClientFunction(() => window.location.href);

    // Enter valid contact information
    await t
        .typeText('#input-name', 'Test User')
        .typeText('#input-email', 'testuser@gmail.com')
        .typeText('#input-enquiry', 'Hello, I would like to know more about the products available in your store. Could you please provide more information?')
        .pressKey('tab')
        .pressKey('enter');

    // Verify navigation to the contact success page
    await t.expect(getURL())
        .contains('route=information/contact/success');
    
    // Verify that the success page has rendered
    await t.expect(Selector('a.btn.btn-primary').withText('Continue').visible)
        .ok();
});


 
// Scenario 2: Submit an enquiry with an invalid email address
test('Scenario 2 - Invalid Email Address', async t => {
    const getURL = ClientFunction(() => window.location.href);

    // Enter contact information with an invalid email address
    await t
        .typeText('#input-name', 'Test User')
        .typeText('#input-email', 'invalid-email')
        .typeText('#input-enquiry', 'Hello, I would like more information about your products.')
        .pressKey('tab')
        .pressKey('enter');

    // Verify that the invalid email error message is displayed
    await t.expect(Selector('.text-danger').withText('E-Mail Address does not appear to be valid!').visible)
        .ok();

    // Verify that the user remains on the Contact Us form
    await t.expect(getURL())
        .contains('route=information/contact');

    await t.expect(getURL())
        .notContains('route=information/contact/success');
});


 
// Scenario 3: Submit an enquiry with an empty message
test('Scenario 3 - Empty Enquiry Message', async t => {
    const getURL = ClientFunction(() => window.location.href);

    // Enter valid contact information but leave the enquiry empty
    await t
        .typeText('#input-name', 'Test User')
        .typeText('#input-email', 'testuser@gmail.com')
        .click('#input-enquiry')
        .pressKey('tab')
        .pressKey('enter');

    // Verify that the empty enquiry error message is displayed
    await t.expect(Selector('.text-danger').withText('Enquiry must be between 10 and 3000 characters!').visible)
        .ok();

    // Verify that the user remains on the Contact Us form
    await t.expect(getURL())
        .contains('route=information/contact');

    await t.expect(getURL())
        .notContains('route=information/contact/success');
});


