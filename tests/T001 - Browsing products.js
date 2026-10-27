import { Selector, test } from "testcafe";

fixture("T001 - Browsing products").page(
    "https://opencart.abstracta.us/index.php?route=product/search&search=",
);

// returns the element that has all the products inside it
function getProductList() {
    // get the 3rd item with the "row" class inside the item with id "content"
    return Selector("#content .row:nth-of-type(3)");
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
    let showPerPageSelectElem = Selector("select")
        // same as: "select#input-limit"
        .withAttribute("id", "input-limit");

    let itemsOnPageDisplayElem = await Selector("div")
        .withAttribute("class", "row")
        .child(".text-right")
        .withText("Showing")
        .filterVisible();

    // get the store item count (19) from the string "Showing 1 to 15 of 19 (2 Pages)"
    let maxItems = parseInt(
        (await itemsOnPageDisplayElem.innerText).split(" of ")[1].split(" ")[0],
    );

    await t
        // set count to 15
        .click(showPerPageSelectElem)
        .click(showPerPageSelectElem.child("option").withText("15"))
        // check if count is actually 15 (or if the store doesn't have enough)
        .expect(getProductListElems().count)
        .eql(Math.min(15, maxItems))
        // set count to 50
        .click(showPerPageSelectElem)
        .click(showPerPageSelectElem.child("option").withText("50"))
        // check if it's actually 50 (or if the store doesn't have enough)
        .expect(getProductListElems().count)
        .eql(Math.min(50, maxItems));
});

// must create the selector in a function or it won't update when the page changes
function getCurrentPageNavBtn() {
    // return Selector("ul.pagination > li.active > span");
    return Selector("ul.pagination").child("li.active").child("span");
}

test("Pagination", async (t) => {
    // get all the page links (that are numbers, not the "jump to" ones)
    const pageLinks = await Selector("ul.pagination").find("a").withText(
        /(\d+)/, // only digits [https://stackoverflow.com/a/19715367]
    );

    // pick random page
    const pageIdx = parseInt(Math.random() * (await pageLinks.count)); // this is the index, not the page #

    const page = pageLinks.nth(pageIdx);

    // get the actual page number (as a string)
    const pageNo = await page.innerText;

    // get the initial product grid text (product name/description/price)
    const initialProducts = await getProductList().textContent;

    await t
        .scrollIntoView(getCurrentPageNavBtn())
        // switch pages
        .click(page);

    // split cuz switching pages

    await t
        .scrollIntoView(getCurrentPageNavBtn())
        // make sure we went to the right page
        .expect(getCurrentPageNavBtn().withText(pageNo).exists)
        .ok()
        // make sure the products are different
        .expect(getProductList().textContent)
        .notEql(initialProducts);
});
