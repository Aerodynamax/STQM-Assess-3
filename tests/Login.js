import { Selector, test } from "testcafe";

fixture("T011 - User Login").page(
    "https://opencart.abstracta.us/index.php?route=account/login"
);

test("Scenario 1 - Login with valid credentials", async (t) => {
    await t
        .typeText("#input-email", "testuser124@example.com")
        .typeText("#input-password", "TestPass123!")
        .click('input[type="submit"][value="Login"]');
    
    await t
        .expect(t.eval(() => window.location.href))
        .contains(
            "https://opencart.abstracta.us/index.php?route=account/account",
            "Redirect to account page"
        );

    await t
        .expect(Selector("#content h2").innerText)
        .eql("My Account",
             "Account page should display");
});

test("Scenario 2 - Login with invalid Email or Password", async (t) => {
    await t
        .typeText("#input-email", "Invalidemail@example.com")
        .typeText("#input-password", "InvalidPass123!")
        .click('input[type="submit"][value="Login"]');
    
    await t
        .expect(Selector(".alert-danger").innerText)
        .contains(
            "E-Mail Address and/or Password.",
            "An error alert should appear for incorrect email or password."
        );    
});

test("Scenario 3 - Login with empty text field", async (t) => {
    await t
        .click('input[type="submit"][value="Login"]');
    
    await t
        .expect(Selector(".alert-danger").innerText)
        .ok();
});