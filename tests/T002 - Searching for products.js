import { Selector, test } from "testcafe";

fixture("T002 - Searching for products").page(
    "https://opencart.abstracta.us/index.php?route=product/search&search=",
);

// returns the element that has all the products inside it
function getProductList() {
    // get the 3rd item with the "row" class inside the item with id "content"
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
    // find the button with the font-awesome search icon elem
    const searchButton = searchHolder.find("i").parent();

    // enter the query
    await t.typeText(searchInputBox, searchString).click(searchButton);

    // split up because page refreshes can have weird results (i dunno i just work here :/)

    // check if all search results contain the word
    await t
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

    // confirm any products exist (they should)
    await t
        .expect(getProductListElems().exists)
        .ok(
            "No products show up for HP even though they are sold on the platform.",
        );

    // click on the first product
    await t.click(getProductListElems().find("a"));

    // check if brand name is correct
    await t.expect(Selector("a").withText(brand).exists).ok();
});

test("Search by description", async (t) => {
    const desc = "3.5mm stereo headset jack";

    // TODO: replace this with the regluar site when it is back
    const descriptionToggle = Selector("input")
        .withAttribute("type", "checkbox")
        .withAttribute("name", "description");

    await t
        // search for the description & click the button
        .typeText(getBodySearchInput(), desc)
        .click(descriptionToggle)
        .click(getBodySearchInput())
        .pressKey("enter");

    // click on the first product
    await t.click(getProductListElems().find("a"));

    const description = Selector("div").withAttribute("id", "tab-description");

    // check if description is in description
    await t.expect(description.find("*").withText(desc).exists).ok();
});
