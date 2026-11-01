import { Selector } from 'testcafe';

// Default navigation for testing
fixture`T008 - Add to Cart (F8)`
    .page`https://opencart.abstracta.us/index.php?route=product/product&product_id=28`;

// Test Scenario 1- Checking if the default amount of products can be added to the cart.
test('Default Quantity of One', async (t) => {
    // identifying the elements of the page to be checked
    const addToCartBtn = Selector('#button-cart');
    // the green message that pops up after successfully adding a product to the cart 
    const successMessage = Selector('.alert-success').filterVisible();
    // the grey element with the cart icon
    const cartHeaderBtn = Selector('#cart-total');

    await t
        // click the 'Add to Cart' submit button
        .click(addToCartBtn)
        // Checking for a correct system message. This is the default confirmation message from OpenCart's source code. 
        .expect(successMessage.innerText).contains('Success: You have added HTC Touch HD to your shopping cart!')
        // confirm that the black cart widget count in header gets updated to 1 item(s)
        .expect(cartHeaderBtn.innerText).contains('1 item(s)');
});

// Test Scenario 2: Checking if multiple products can be added to the cart.
test('Multiple Standard Products', async (t) => {
    // identifying the elements of the page to be checked
    const qtyInput = Selector('#input-quantity');
    const addToCartButton = Selector('#button-cart');
    const successMessage = Selector('.alert-success').filterVisible();

    await t
        // Clear default quantity and set to 3
        .selectText(qtyInput)
        .pressKey('delete')
        .typeText(qtyInput, '3')
        // Submit add to cart
        .click(addToCartButton)
        // Verify confirmation banner
        .expect(successMessage.innerText).contains('Success: You have added HTC Touch HD to your shopping cart!');
});

// Test Scenario 3: Checking for exceptions in validation errors from missing forms.
test('Missing Forms', async (t) => {
    // Navigate to Canon EOS 5D, which requires the user to select a colour for the product.
    await t.navigateTo('https://opencart.abstracta.us/index.php?route=product/product&product_id=30&search=');

    const addToCartButton = Selector('#button-cart');
    const requiredErrorMessage = Selector('.text-danger').filterVisible();

    await t
        // Attempt to click Add to Cart without picking required option
        .click(addToCartButton)
        // Making sure that an error message pops ups as exception in validation
        .expect(requiredErrorMessage.visible).ok()
        // Checking for correct text in system message.
        .expect(requiredErrorMessage.innerText).contains('Select required!');
});