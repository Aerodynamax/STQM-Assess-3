import { ClientFunction, Selector, test } from "testcafe";

fixture("T003 - Wishlist").page(
    "https://opencart.abstracta.us/index.php?route=account/wishlist",
);

//region helper funcs

// https://stackoverflow.com/a/57035840
const getURL = ClientFunction(() => window.location.href);

const switchToPageIfReq = async (url, t) => {
    // go to page (if not already on it)
    if ((await getURL()) !== url) {
        await t.navigateTo(url);
    }
};

const loginBeforeFunc = async (t) => {
    // go to login page (if not already on it)
    await switchToPageIfReq(
        "https://opencart.abstracta.us/index.php?route=account/login",
        t,
    );

    // login
    const emailField = Selector("#input-email");
    const passwordField = Selector("#input-password");
    const loginBtn = Selector(`input[type="submit"]`);

    await t
        .typeText(emailField, "xirive4433@ofags.com")
        .typeText(passwordField, "Password")
        .click(loginBtn);

    // verify login was successful
    await t
        .expect(getURL())
        .notEql("https://opencart.abstracta.us/index.php?route=account/login");
};
const logoutAfterFunc = async (t) => {
    // logout
    await t.navigateTo(
        "https://opencart.abstracta.us/index.php?route=account/logout",
    );
};

//endregion

test("Wishlist without account", async (t) => {
    const wishlistBtn = Selector(`[data-original-title="Add to Wish List"]`);
    const confirmationPopup = Selector("div.alert").filterVisible();

    await t
        // click add to wishlist
        .click(wishlistBtn)
        // check if failure popup shows
        .expect(
            confirmationPopup.withText(
                "You must login or create an account to save Palm Treo Pro to your wish list!",
            ).exists,
        )
        .ok();
}).page(
    "https://opencart.abstracta.us/index.php?route=product/product&product_id=29", // Palm Treo Pro
);

test("Wishlist with account", async (t) => {
    // go to Palm Treo Pro product page
    await switchToPageIfReq(
        "https://opencart.abstracta.us/index.php?route=product/product&product_id=29",
        t,
    );

    const wishlistBtn = Selector(`[data-original-title="Add to Wish List"]`);
    const confirmationPopup = Selector("div.alert").filterVisible();

    await t
        // click add to wishlist
        .click(wishlistBtn)
        // check if success popup shows
        .expect(
            confirmationPopup.withText(
                "Success: You have added Palm Treo Pro to your wish list!",
            ).exists,
        )
        .ok();
})
    .skipJsErrors() // page errors occasionally get hit yet do not impact the page or test (error: "ReferenceError: pagespeed is not defined")
    .before(loginBeforeFunc)
    .after(logoutAfterFunc);

//region wishlist page helper funcs

function getCartListElems() {
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
    // a list of all items in the wishlist
    const productRows = Selector("#content tbody>tr");

    // check if "Wishlist with account" worked
    await t.expect(productRows.count).gt(0);

    // first product in wishlist
    const productRow = productRows.nth(0);

    // first product's name
    const productName = (
        await productRow.child("td.text-left").innerText
    ).trim();

    // first product's "add to cart" button
    const productAddToCartBtn = productRow.find(
        `button[data-original-title="Add to Cart"]`,
    );

    // toggle cart preview button
    const showCartPreviewBtn = Selector("#cart > button");

    // open the cart preview
    await t.click(showCartPreviewBtn);

    // the first wishlist item's elem that says the current count in the cart ("x1"/"x2"/etc.)
    const productInCartCountElem = getCartListElems()
        .withText(productName)
        .child("td.text-right");

    // get the original count to compare later
    const productAlreadyInCartCount = await getCartItemCount(
        productInCartCountElem,
    );

    await t
        // close cart preview (so the "add to cart" button is visible/clickable)
        .click(showCartPreviewBtn)
        // add product to cart
        .click(productAddToCartBtn)
        // open cart preview to check if successful
        .click(showCartPreviewBtn)
        // check if add to cart works (if the counter goes like: "x 1" => "x 2")
        .expect(productInCartCountElem.innerText)
        .eql("x " + (productAlreadyInCartCount + 1))
        // check if still in wishlist
        .expect(productRows.innerText)
        .contains(productName);

    // (cleanup) remove from cart
    const removeFromCartBtn = getCartListElems()
        .withText(productName)
        .find(`button[title="Remove"]`);

    await t.click(removeFromCartBtn);
})
    .skipJsErrors() // page errors occasionally get hit yet do not impact the page or test (error: "ReferenceError: pagespeed is not defined")
    .before(loginBeforeFunc)
    .after(logoutAfterFunc);
