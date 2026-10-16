import { Selector } from "testcafe";

fixture("Getting Started").page(
    "https://devexpress.github.io/testcafe/example",
);

test("My first test", async (t) => {
    // Test code goes here
    await t.typeText(Selector("#developer-name"), "John Smith").wait(2000);
});
