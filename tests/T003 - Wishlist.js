import { ClientFunction, Selector, test } from "testcafe";

fixture("T003 - Wishlist").page(
    "https://opencart.abstracta.us/index.php?route=account/wishlist",
);

//region helper funcs

// https://stackoverflow.com/a/57035840
const getURL = ClientFunction(() => window.location.href);

async function switchToPageIfReq(url, t) {
    // go to page (if not already on it)
    if ((await getURL()) !== url) {
        await t.navigateTo(url);
    }
};

async function loginBeforeFunc(t) {
    // go to login page (if not already on it)
    await switchToPageIfReq("https://opencart.abstracta.us/index.php?route=account/login", t);

    // login email input, password input & login button
    const emailField = Selector("#input-email");
    const passwordField = Selector("#input-password");
    const loginBtn = Selector(`input[type="submit"]`);

    // login
    await t
        .typeText(emailField, "wishlist-test@email.com")
        .typeText(passwordField, "Password")
        .click(loginBtn);

    // verify login was successful
    await t
        .expect(getURL())
        .notEql("https://opencart.abstracta.us/index.php?route=account/login", "Couldn't login to wishlist test account");
};
async function logoutAfterFunc(t) {
    // logout
    await t.navigateTo("https://opencart.abstracta.us/index.php?route=account/logout");
};

//endregion

test("Wishlist without account", async (t) => {
    const wishlistBtn = Selector(`[data-original-title="Add to Wish List"]`);
    const confirmationPopup = Selector("div.alert").filterVisible();

    await t
        // click add to wishlist
        .click(wishlistBtn)
        // check if failure popup shows
        .expect(confirmationPopup.innerText)
        .contains("You must login or create an account to save Palm Treo Pro to your wish list!");
}).page(
    "https://opencart.abstracta.us/index.php?route=product/product&product_id=29", // Palm Treo Pro
);

test("Wishlist with account", async (t) => {
    // go to Palm Treo Pro product page
    await switchToPageIfReq("https://opencart.abstracta.us/index.php?route=product/product&product_id=29", t);

    const wishlistBtn = Selector(`[data-original-title="Add to Wish List"]`);
    const confirmationPopup = Selector("div.alert").filterVisible();

    await t
        // click add to wishlist
        .click(wishlistBtn)
        // check if success popup shows
        .expect(confirmationPopup.innerText)
        .contains("Success: You have added Palm Treo Pro to your wish list!");
})
    .skipJsErrors()             // JS errors occasionally get hit yet do not impact the page or test
    .before(loginBeforeFunc)    // (error in question: "ReferenceError: pagespeed is not defined")
    .after(logoutAfterFunc);

//region wishlist page helper funcs

function getCartPreviewListElems() {
    return Selector("#cart table")
        .filter(".table-striped")
        .child("tbody")
        .child("tr");
}

async function getCartItemCount(cartItem) {
    // zero if not in cart
    if (!(await cartItem.exists)) return 0;

    // first text right item is the count
    return parseInt((await cartItem.innerText).replace("x ", ""));
}

//endregion

test("Wishlist add to cart", async (t) => {
    // go to wishlist page if not on it
    await switchToPageIfReq(
        "https://opencart.abstracta.us/index.php?route=account/wishlist",
        t,
    );

    const confirmationPopup = Selector("div.alert").filterVisible(); // confirmation popup
    const showCartPreviewBtn = Selector("#cart > button"); // toggle cart preview button
    const productRows = Selector("#content tbody>tr"); // the rows of products in the wishlist

    // confirm wishlist has items
    await t.expect(productRows.count).gt(0);

    // get the first product in wishlist, its name, and add to cart button
    const productRow = productRows.nth(0);
    const productName = (await productRow.child("td.text-left").innerText).trim();
    const productAddToCartBtn = productRow.find(`button[data-original-title="Add to Cart"]`);

    
    // open the cart preview
    await t.click(showCartPreviewBtn);

    // the elem that holds the number of the wishlist item in the cart ("x1"/"x2"/etc.)
    const productInCartCountElem = getCartPreviewListElems()
        .withText(productName)
        .child("td.text-right");

    // get the original count to compare later
    const productAlreadyInCartCount = await getCartItemCount(productInCartCountElem);


    await t
        // close cart preview (so the "add to cart" button is visible/clickable)
        .click(showCartPreviewBtn)
        // add product to cart
        .click(productAddToCartBtn)
        // check if confirmation popup shows
        .expect(confirmationPopup.innerText)
        .contains("Success: You have added Palm Treo Pro to your shopping cart!")
        // open cart preview to check if successful
        .click(showCartPreviewBtn)
        // check if add to cart works (if the counter goes like: "x 1" => "x 2")
        .expect(productInCartCountElem.innerText)
        .eql("x " + (productAlreadyInCartCount + 1))
        // check if still in wishlist
        .expect(productRows.innerText)
        .contains(productName);

    // (cleanup) remove from cart
    const removeFromCartBtn = getCartPreviewListElems()
        .withText(productName)
        .find(`button[title="Remove"]`);

    await t.click(removeFromCartBtn);
})
    .skipJsErrors()             // JS errors occasionally get hit yet do not impact the page or test
    .before(loginBeforeFunc)    // (error in question: "ReferenceError: pagespeed is not defined")
    .after(logoutAfterFunc);
