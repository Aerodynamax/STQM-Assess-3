import { Selector, test } from "testcafe";
fixture("T010 - User Registration").page(
    "https://opencart.abstracta.us/index.php?route=account/register"
);
const email = `testuser${Date.now()}@example.com`;

test("Scenario 1 - Register with valid inputs", async (t) => {
    await t
        .typeText("#input-firstname", "User")
        .typeText("#input-lastname", "Test")
        .typeText("#input-email", email)
        .typeText("#input-telephone", "0410101010")
        .typeText("#input-password", "TestPass123!")
        .typeText("#input-confirm", "TestPass123!");

    await t
        .click('input[name="agree"]')
        .click('input[type="submit"][value="Continue"]');
    await t
        .expect(t.eval(() => window.location.href))
        .contains("https://opencart.abstracta.us/index.php?route=account/success", "the user should be redirected to the successfully registrate page");
    await t
        .expect(Selector("#content h1").innerText)
        .eql("Account", "An account has been successfully created!");
});

test("Scenario 2 - Register with an invalid inputs", async (t) => {

    await t
        .typeText("#input-email", 'invalid-email@haha')
        .typeText("#input-telephone", "0")
        .typeText("#input-confirm", "DifferentTestPass123!")
        .click('input[type="submit"][value="Continue"]');

    await t
        .expect(Selector(".text-danger").count)
        .gt(0, "Validation errors should appear for invalid and missing input.");
});

test("Scenario 3 - Register without agreeing to the policy", async (t) =>{
    await t
        .typeText("#input-firstname", "User")
        .typeText("#input-lastname", "Test")
        .typeText("#input-email", email)
        .typeText("#input-telephone", "0410101010")
        .typeText("#input-password", "TestPass123!")
        .typeText("#input-confirm", "TestPass123!");

    await t
        .click('input[type="submit"][value="Continue"]');

    await t
        .expect(Selector(".alert-danger").innerText)
        .contains(
            "Warning: You must agree to the Privacy Policy!",
            "An alert should appear when the Privacy Policy is unticked."
        );
});


