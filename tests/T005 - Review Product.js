import { Selector } from 'testcafe';

// T005 - Review Product (F7)
// Product: HTC Touch HD

fixture`T005 - Review Product`
    .page`https://opencart.abstracta.us/index.php?route=product/product&product_id=28`;

// Scenario 1: Submit a valid product review
test('Scenario 1 - Valid Review Submission', async t => {
    // Open the Reviews tab
    await t.click('a[href="#tab-review"]');

    // Enter valid review information
    await t
        .typeText('#input-name', 'Test User')
        .typeText('#input-review', 'This product has a clear display and is easy to use. The overall quality is very good.')
        .click('input[name="rating"][value="5"]')
        .click('#button-review');

    // Verify the successful submission message
    const successMessage = Selector('.alert-success');

    await t.expect(successMessage.innerText)
        .contains('Thank you for your review. It has been submitted to the webmaster for approval.');
});


 // Scenario 2: Submit a review with text that is too short
test('Scenario 2 - Review Text Too Short', async t => {
    // Open the Reviews tab
    await t.click('a[href="#tab-review"]');

    // Enter a valid name but a review shorter than 25 characters
    await t
        .typeText('#input-name', 'Test User')
        .typeText('#input-review', 'good')
        .click('input[name="rating"][value="5"]')
        .click('#button-review');

    // Verify the review text validation warning
    const warningMessage = Selector('.alert-danger');

    await t.expect(warningMessage.innerText)
        .contains('Warning: Review Text must be between 25 and 1000 characters!');
});


 // Scenario 3: Submit a review without selecting a rating
test('Scenario 3 - Missing Rating', async t => {
    // Open the Reviews tab
    await t.click('a[href="#tab-review"]');

    // Enter valid review information without selecting a rating
    await t
        .typeText('#input-name', 'Test User')
        .typeText('#input-review', 'This product has a clear display and is easy to use. The overall quality is very good.')
        .click('#button-review');

    // Verify the missing rating validation warning
    const warningMessage = Selector('.alert-danger');

    await t.expect(warningMessage.innerText)
        .contains('Warning: Please select a review rating!');
});


