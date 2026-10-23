import { Selector, test } from "testcafe";

fixture("T002 - Searching for products").page(
    "https://opencart.abstracta.us/index.php?route=product/search",
    // "https://ecommerce-playground.lambdatest.io/index.php?route=product/search&search=",
);

// returns the element that has all the products inside it
// function getProductList() {
//     return Selector("div")
//         .withAttribute(
//             "data-grid",
//             "product-layout product-grid no-desc col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6",
//         )
//         .withAttribute("data-view_id", "grid");
// }

// TODO: remove override because site is down
function getProductList() {
    return Selector("#content .row:nth-of-type(3)");
}

// returns the elements in the product list
function getProductListElems() {
    return getProductList().child(".product-layout");
}

test("Search by name", async (t) => {
    const searchString = "iPhone";

    const searchHolder = Selector("#search").filterVisible();
    const searchInputBox = searchHolder.find(`input[name="search"]`);

    await t
        // .debug()
        // .click(searchInputBox)
        .typeText(searchInputBox, searchString)
        .click(searchHolder.find(`button[type="submit"]`));

    // check if all search results contain the word
    // i don't know why, but splitting these up makes the .eql() get the actual product list instead of the original one
    await t
        .expect(
            getProductListElems().find(`h4.title`).withText(searchString).count,
        )
        .eql(await getProductListElems().count);
});

// function getBodySearchBarHolder() {
//     return Selector("#input-search").filterVisible();
// }
function getBodySearchInput() {
    return Selector(`input`)
        .withAttribute("placeholder", "Keywords")
        .withAttribute("name", "search");
}

test("Search by brand", async (t) => {
    const brand = "Apple";

    await t
        // search for the brand
        .typeText(getBodySearchInput(), brand)
        .pressKey("enter");

    // click on the site
    await t.click(getProductListElems().find("a"));

    // check if brand name is correct
    await t.expect(Selector("a").withText(brand).exists).ok();
});

test("Search by description", async (t) => {
    const desc = "3.5mm stereo headset jack";

    // TODO: replace this with the regluar site when it is back
    const descriptionToggle = Selector("input").withAttribute(
        "type",
        "checkbox",
    );

    await t
        // search for the description & click the button
        .typeText(getBodySearchInput(), desc)
        .click(descriptionToggle)
        .click(getBodySearchInput())
        .pressKey("enter");

    // check if brand name is correct
    await t.expect(Selector("a").withText(desc).exists).notOk();
});
