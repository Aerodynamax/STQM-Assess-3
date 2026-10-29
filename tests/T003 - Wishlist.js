import { ClientFunction, Selector, test } from "testcafe";

fixture("T003 - Wishlist").page(
    "https://opencart.abstracta.us/index.php?route=account/wishlist",
);

test("Wishlist without account", async (t) => {
    const wishlistButton = Selector(`[data-original-title="Add to Wish List"]`);

    await t.click(wishlistButton);

    // check if successful
    await t
        .expect(
            Selector("div.alert").withText(
                " You must login or create an account to save Palm Treo Pro to your wish list!",
            ).exists,
        )
        .ok();
}).page(
    "https://opencart.abstracta.us/index.php?route=product/product&product_id=29", // Palm Treo Pro
);

// https://stackoverflow.com/a/57035840
const getURL = ClientFunction(() => window.location.href);

const loginBeforeFunc = async (t) => {
    // go to login page
    await t.navigateTo(
        "https://opencart.abstracta.us/index.php?route=account/login",
    ); // login page

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
        .eql("https://opencart.abstracta.us/index.php?route=account/account");
};
const logoutAfterFunc = async (t) => {
    // logout
    await t.navigateTo(
        "https://opencart.abstracta.us/index.php?route=account/logout",
    );
};

test("Wishlist with account", async (t) => {
    // go to right page
    await t.navigateTo(
        "https://opencart.abstracta.us/index.php?route=product/product&product_id=29",
    ); // Palm Treo Pro

    // try to wishlist

    const wishlistButton = Selector(`[data-original-title="Add to Wish List"]`);

    await t.click(wishlistButton);

    // check if successful
    await t
        .expect(
            Selector("div.alert").withText(
                " Success: You have added Palm Treo Pro to your wish list!",
            ).exists,
        )
        .ok();
})
    .page("https://opencart.abstracta.us/index.php?route=account/wishlist")
    .before(loginBeforeFunc)
    .after(logoutAfterFunc);

function getCartListElems() {
    return Selector("#cart table")
        .filter(".table-striped")
        .child("tbody")
        .child("tr");
}

async function getCartItemCount(cartItem) {
    if (!(await cartItem.exists)) return 0;

    return parseInt(
        (await cartItem.child("td.text-right").innerText) // first text right item is the count
            .replace("x ", ""),
    );
}

test("Wishlist add to cart", async (t) => {
    // go to right page
    await t.navigateTo(
        "https://opencart.abstracta.us/index.php?route=account/wishlist",
    );

    const productRows = Selector("#content tbody>tr");

    // check if "Wishlist with account" worked
    await t.expect(productRows.count).gt(0);

    // add first product in wishlist to cart
    const productRow = await productRows.nth(0);

    const productName = (
        await productRow.child("td.text-left").innerText
    ).trim();

    const addToCartButton = productRow.find(
        `button[data-original-title="Add to Cart"]`,
    );

    // open cart preview
    const showCartPreviewBtn = Selector("#cart > button");
    await t.click(showCartPreviewBtn);
    // click only if not open
    // if (
    //     !(await showCartPreviewBtn.withAttribute("aria-expanded", "true")
    //         .exists)
    // )

    const productAlreadyInCartRow = getCartListElems().withText(productName);

    const productAlreadyInCartCount = await getCartItemCount(
        await productAlreadyInCartRow,
    );

    // close cart preview
    await t.click(showCartPreviewBtn);

    // check if add to cart works
    await t
        .click(addToCartButton)
        .click(showCartPreviewBtn)
        .expect(
            getCartListElems().withText(productName).child("td.text-right")
                .innerText,
        )
        .eql("x " + (productAlreadyInCartCount + 1));

    // cleanup (remove from cart)
    const removeFromCartBtn = getCartListElems()
        .withText(productName)
        .find(`i.fa-times`)
        .parent();

    await t.click(removeFromCartBtn);
})
    .page("https://opencart.abstracta.us/index.php?route=account/wishlist")
    .before(loginBeforeFunc)
    .after(logoutAfterFunc);
