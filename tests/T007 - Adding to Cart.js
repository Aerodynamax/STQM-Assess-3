import { Selector, ClientFunction } from 'testcafe';

// helping user to get the page url after changing pages
const getURL = ClientFunction(() => window.location.href);

fixture`T009 - Shopping Cart Management (F9)`
    .page`https://opencart.abstracta.us/index.php?route=product/product&product_id=28&search=`;

// Test Scenario 1: Adding items to carts
test('Adding items to carts', async (t) => {
    // Product page elements
    const addToCartButton = Selector('#button-cart');
    const cartHeaderButton = Selector('#cart');
    const viewCartLink = Selector('strong').withText('View Cart');
    
    // Shopping cart page elements
    const quantityInput = Selector('input[name^="quantity"]');
    const updateButton = Selector('button[data-original-title="Update"]');
    const successMessage = Selector('.alert-success').filterVisible();

    await t
        // adding the product to the cart
        .click(addToCartButton)
        // opening the cart element
        .click(cartHeaderButton)
        // clicking the link to the cart page 
        .click(viewCartLink)
        // validating page routing
        .expect(getURL()).contains('route=checkout/cart')
        
        // increasing the quantity of a product from 1 to 2
        .selectText(quantityInput)
        .pressKey('delete')
        .typeText(quantityInput, '2')
        .click(updateButton)
        
        // validating text in the confirmation message after updating
        .expect(successMessage.innerText).contains('Success: You have modified your shopping cart!');
});

// Test Scenario 2: Removing items in cart
test('Removing items in cart', async (t) => {
    const addToCartBtn = Selector('#button-cart');
    const cartHeaderBtn = Selector('#cart');
    const viewCartLink = Selector('strong').withText('View Cart');
    
    const removeButton = Selector('button[data-original-title="Remove"]').nth(0);
    const emptyCartText = Selector('#content');

    await t
        // adding product to cart
        .click(addToCartBtn)
        .click(cartHeaderBtn)
        // navigating to cart page from product page
        .click(viewCartLink)
        
        // clicking the remove button of the product 
        .click(removeButton)
        
        // validating text in the confirmation message after updating
        .expect(emptyCartText.innerText).contains('Your shopping cart is empty!');
});

// Test Scenario 3: Verifying Empty Cart 
test('Verifying Empty Cart ', async (t) => {
    // moving directly to cart page without adding products to cart
    await t.navigateTo('https://opencart.abstracta.us/index.php?route=checkout/cart');

    const emptyCartText = Selector('#content');


    await t
        // make sure that the shopping cart shows this message
        .expect(emptyCartText.innerText).contains('Your shopping cart is empty!')

});