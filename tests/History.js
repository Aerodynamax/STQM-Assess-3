import { Selector, test } from "testcafe";

fixture("T012 - Purchase History").page(
    "https://opencart.abstracta.us/index.php?route=account/login"
);
const orderRows = Selector("#content table tbody tr");

async function openOrderHistory(t) {
    await t.navigateTo("https://opencart.abstracta.us/index.php?route=account/order");
}


test("Scenario 1 - Access purchase history with no orders", async (t) => {
    await t
        .typeText("#input-email", "noorders@example.com")
        .typeText("#input-password", "correctpassword")
        .click('input[type="submit"][value="Login"]');

    await openOrderHistory(t);

    await t
        .expect(Selector("#content").innerText)
        .contains("Your shopping cart is empty!");

    await t.expect(orderRows.count).eql(0);
});

test("Scenario 2 - Purchase History with existing orders", async (t) => {
    await t
        .typeText("#input-email", "testuserwith2orders@example.com")
        .typeText("#input-password", "TestPass123!")
        .click('input[type="submit"][value="Login"]');

    await openOrderHistory(t);

    await t.expect(orderRows.count).eql(2);

    await t
        .expect(Selector("#content").innerText)
        .contains("Order ID");
});

test("Scenario 3 - Inspect order information", async (t) => {
    await t
        .typeText("#input-email", "testuserwith2orders@example.com")
        .typeText("#input-password", "TestPass123!")
        .click('input[type="submit"][value="Login"]');

    await openOrderHistory(t);

    await t.expect(orderRows.count).gt(0);

    const Inspectbutton = Selector("#content table tbody tr:first-child a.btn-info");

    const Url = await Inspectbutton.getAttribute("href");

    const orderId = new URL(Url, "https://opencart.abstracta.us").searchParams.get("order_id");

    await t.expect(orderId).notEql(null);

    await t.click(Selector(Inspectbutton));

    await t
        .expect(t.eval(() => window.location.href))
        .contains(`route=account/order/info&order_id=${orderId}`);

    await t
        .expect(Selector("#content td").withText("Order Details").exists)
        .ok();

    const productRow = Selector("#content table tbody tr")
        .filter((node) => node.querySelector('a[href*="route=account/order/reorder"]') !== null);

    const reorderLink = productRow.find(
        'a[href*="route=account/order/reorder"]'
    );
    const returnLink = productRow.find(
    'a[href*="route=account/return/add"]'
    );

    await t.expect(reorderLink.exists).ok();

    const reorderUrl = await reorderLink.getAttribute("href");

    await t.expect(reorderUrl)
        .contains("route=account/order/reorder");

    await t.expect(reorderUrl)
        .contains(`order_id=${orderId}`);

    const orderProductId = new URL(
        reorderUrl,
        "https://opencart.abstracta.us"
    ).searchParams.get("order_product_id");

    await t.expect(orderProductId).notEql(null);

    await t.expect(returnLink.exists).ok();

    const returnUrl = await returnLink.getAttribute("href");

    await t.expect(returnUrl)
        .contains("route=account/return/add");

    await t.expect(returnUrl)
        .contains(`order_id=${orderId}`);

    const productId = new URL(
        returnUrl,
        "https://opencart.abstracta.us"
    ).searchParams.get("product_id");

    await t.expect(productId).notEql(null);
});

test("Scenario 4 - Purchase History requires login", async (t) => {
    await t.navigateTo("https://opencart.abstracta.us/index.php?route=account/order");

    await t
        .expect(t.eval(() => window.location.href))
        .contains("route=account/login");
});
