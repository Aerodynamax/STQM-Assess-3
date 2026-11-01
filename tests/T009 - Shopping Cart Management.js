import { Selector, ClientFunction } from 'testcafe';

// helping user to get the page url after changing pages
const getURL = ClientFunction(() => window.location.href);

fixture`T010 - Compare Products (F10)`
    .page`https://opencart.abstracta.us/index.php?route=product/search&search=`;

// Test Scenario 1: Adding one product to an empty comparison table
test('Scenario 1 - Add Product to Compare List (Success)', async (t) => {
    // the double arrow button for adding a product to the comparison table
    const compareButton = Selector('.fa-exchange').nth(0);
    const successMessage = Selector('.alert-success').filterVisible();
    const compareLinkHeader = Selector('#compare-total');

    await t
        // clicking the double arrow button respectfully assigned to a product
        .click(compareButton)
        // verifying that a product has been successfully added
        .expect(successMessage.innerText).contains('Success: You have added')
        // making sure that the product compare header gets updated for the first time
        .expect(compareLinkHeader.innerText).contains('Product Compare (1)');
});

// Test Scenario 2: Comparison Table Accessibility
test('Scenario 2 - Navigate to Compare Table Page', async (t) => {
    const compareLink = Selector('#compare-total');

    await t
        // click the comparison table link
        .click(compareLink)
        // Verify browser redirects to product compare route
        .expect(getURL()).contains('route=product/compare');
});

// Test Scenario 3: Verifying Empty Comparison Table
test('Scenario 3 - Empty Comparison Page State', async (t) => {
    // while there is no product in the cart
    await t.navigateTo('https://opencart.abstracta.us/index.php?route=product/compare');

    const emptyCart = Selector('#content');

    await t
        // verifying that an empty shopping cart gets updated to show this message
        .expect(emptyCart.innerText).contains('Your shopping cart is empty!');
});