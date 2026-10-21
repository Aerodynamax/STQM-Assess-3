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
        // check if all items are in list view form
        .click(listButton)
        .expect(getProductListElems().filter(".product-list").count)
        .eql(await getProductListElems().count)
        // check if all items are in grid view form
        .click(gridButton)
        .expect(getProductListElems().filter(".product-grid").count)
        .eql(await getProductListElems().count);
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

// must create the selector in a function or it won't update when the page changes
function getCurrentPageNavBtn() {
    // return Selector("ul.pagination > li.active > span");
    return (
        Selector("ul.pagination")
            // .withAttribute("class", "pagination")
            .child("li.active")
            // .withAttribute("class", "active")
            .child("span")
    );
}

test("Pagination", async (t) => {
    // get all the page links (that are numbers, not the "jump to" ones)
    const pageLinks = await Selector("ul.pagination a.page-link").withText(
        /(\d+)/, // only digits [https://stackoverflow.com/a/19715367]
    );

    // pick random page
    const pageIdx = parseInt(Math.random() * (await pageLinks.count)); // this is the index, not the page #

    const page = pageLinks.nth(pageIdx);

    // get the actual page number (as a string)
    const pageNo = await page.innerText;

    // get the initial products
    const initialProducts = await getProductListElems();

    await t
        .scrollIntoView(getCurrentPageNavBtn())
        // switch pages
        .click(page)
        .scrollIntoView(getCurrentPageNavBtn())
        // make sure we went to the right page
        .expect(getCurrentPageNavBtn().withText(pageNo).exists)
        .ok()
        // make sure the items are different
        .expect(await getProductListElems())
        .notContains(initialProducts);
});
