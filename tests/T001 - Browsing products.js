import { Selector } from "testcafe";

fixture("Browsing products").page(
    "https://ecommerce-playground.lambdatest.io/index.php?route=product/search&search=",
);

test("Grid & list view", async (t) => {
    let listButton = Selector("button").withAttribute("id", "list-view");
    let gridButton = Selector("button").withAttribute("id", "grid-view");

    let productList = Selector("div")
        .withAttribute(
            "data-grid",
            "product-layout product-grid no-desc col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6",
        )
        .withAttribute("data-view_id", "grid");

    await t
        .scrollIntoView(productList)
        .scrollIntoView(gridButton)
        .wait(250)
        // check if list view renders
        .click(listButton)
        .expect(productList.child("div").classNames)
        .contains("product-list")
        .wait(500)
        // check if grid view renders
        .click(gridButton)
        .expect(productList.child("div").classNames)
        .contains("product-grid");
});
