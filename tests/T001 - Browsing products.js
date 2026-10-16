import { Selector, test } from "testcafe";

fixture("Browsing products").page(
    "https://ecommerce-playground.lambdatest.io/index.php?route=product/search&search=",
);

// returns the element that has all the products inside it
function getProductList() {
    return Selector("div")
        .withAttribute(
            "data-grid",
            "product-layout product-grid no-desc col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6",
        )
        .withAttribute("data-view_id", "grid");
}

// returns the elements in the product list
function getProductListElems() {
    return getProductList().child("div.product-layout");
}

test("Grid & list view", async (t) => {
    let listButton = Selector("button").withAttribute("id", "list-view");
    let gridButton = Selector("button").withAttribute("id", "grid-view");

    await t
        // check if list view renders
        .click(listButton)
        .expect(getProductListElems().classNames)
        .contains("product-list")
        // check if grid view renders
        .click(gridButton)
        .expect(getProductListElems().classNames)
        .contains("product-grid");
});

test("Items per page", async (t) => {
    // get the # of items to show <select> elem
    let showPerPageSelectElem = Selector("span")
        .withAttribute("class", "input-group-text")
        .withText("Show:")
        .parent()
        .nextSibling("select");

    await t
        // set count to 15
        .click(showPerPageSelectElem)
        .click(showPerPageSelectElem.child("option").withText("15"))
        // check if count is actually 15
        .expect(getProductListElems().count)
        .eql(15)
        // set count to 50
        .click(showPerPageSelectElem)
        .click(showPerPageSelectElem.child("option").withText("50"))
        // check if it's actually 50
        .expect(getProductListElems().count)
        .eql(50);
});
