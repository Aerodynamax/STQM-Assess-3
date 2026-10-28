import { Selector, test } from "testcafe";

fixture("T002 - Searching for products").page(
    "https://opencart.abstracta.us/index.php?route=product/search&search",
);

// returns the element that has all the products inside it
function getProductList() {
    // get the "row" with the products inside the main page section
    return Selector("#content .row:has(>.product-layout)");
}

// returns the elements in the product list
function getProductListElems() {
    return getProductList().child(".product-layout");
}

test("Search by name", async (t) => {
    const searchString = "iPhone";

    const searchHolder = Selector("#search").filterVisible();
    const searchInputBox = searchHolder.find(`input[name="search"]`);
    // find the button with the font-awesome search icon elem
    const searchButton = searchHolder.find("i").parent();

    // enter the query
    await t.typeText(searchInputBox, searchString).click(searchButton);

    // split up because page refreshes can have weird results (i dunno i just work here :/)

    // check if all search results contain the word
    await t
        .scrollIntoView(getProductList())
        .expect(getProductListElems().withText(searchString).count)
        .eql(await getProductListElems().count);
});

function getBodySearchInput() {
    return Selector(`input`)
        .withAttribute("placeholder", "Keywords")
        .withAttribute("name", "search");
}

test("Search by brand", async (t) => {
    const brand = "Hewlett-Packard";

    await t
        // search for the brand
        .typeText(getBodySearchInput(), brand)
        .pressKey("enter");

    // store the results for checking later
    const searchResults = (await getProductList().exists)
        ? await getProductList().innerText
        : "";

    // go to the brand page
    await t.navigateTo(
        "https://opencart.abstracta.us/index.php?route=product/manufacturer/info&manufacturer_id=7",
    );
    // dynamic way
    // const brandsLink = Selector("a").withExactText("Brands");

    // await t.click(brandsLink);

    // const brandPageLink = Selector("a").withExactText(brand);

    // await t.click(brandPageLink);

    // check if test is valid
    await t
        .expect(getProductListElems().exists)
        .ok(
            "Hewlett-Packard has no listed products.  This test must be revised",
        );

    // confirm the products match
    await t
        .scrollIntoView(getProductList())
        .expect(getProductList().innerText)
        .eql(
            searchResults,
            "Hewlett-Packard product listing mismatch in search & brand pages",
        );

    // confirm the brand name is correct for first product (just in case)

    // click on the first product
    await t.click(getProductListElems().find("a"));

    // check if brand name is correct
    await t.expect(Selector("a").withText(brand).exists).ok();
});

test("Search by description", async (t) => {
    const desc = "3.5mm stereo headset jack";

    const descriptionToggle = Selector("input")
        .withAttribute("type", "checkbox")
        .withAttribute("name", "description");

    await t
        // search for the description & click the button
        .click(descriptionToggle)
        .typeText(getBodySearchInput(), desc)
        .pressKey("enter");

    // click on the first product
    await t.click(getProductListElems().find("a"));

    const description = Selector("div").withAttribute("id", "tab-description");

    // check if description is in description
    await t
        .scrollIntoView(description)
        .expect(description.find("*").withText(desc).exists)
        .ok();
});
