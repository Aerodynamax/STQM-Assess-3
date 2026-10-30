import { Selector } from 'testcafe';

// T004 - Product Page (F6)
// Product: HTC Touch HD

fixture`T004 - Product Page`
    .page`https://opencart.abstracta.us/index.php?route=product/product&product_id=28`;

// Scenario 1: Verify the correct product information is displayed.
test('Scenario 1 - Verify product information', async t => {
    const productName = Selector('#content h1');
    const productDetails = Selector('#content');

    // Verify the product name.
    await t.expect(productName.innerText).eql('HTC Touch HD');

    // Verify the product price.
    await t.expect(productDetails.innerText).contains('$122.00');

    // Verify product availability information is displayed.
    await t.expect(productDetails.innerText).contains('Availability:');
});


// Scenario 2: Verify the product description tab works correctly.
test('Scenario 2 - Verify product description tab', async t => {
    const reviewsTab = Selector('a[href="#tab-review"]');
    const descriptionTab = Selector('a[href="#tab-description"]');
    const descriptionContent = Selector('#tab-description');
    const reviewContent = Selector('#tab-review');

    // Switch to the Reviews tab.
    await t.click(reviewsTab);

    // Verify the Reviews content appears and Description is hidden.
    await t.expect(reviewContent.visible).ok();
    await t.expect(descriptionContent.visible).notOk();

    // Switch back to the Description tab.
    await t.click(descriptionTab);

    // Verify the description is displayed again.
    await t.expect(descriptionContent.visible).ok();

    // Verify the correct product description and features are displayed.
    await t.expect(descriptionContent.innerText).contains('HTC Touch');
    await t.expect(descriptionContent.innerText).contains('Features');
});


// Scenario 3: Verify the product image gallery works correctly.
test('Scenario 3 - Verify product image gallery', async t => {
    const secondThumbnail = Selector('ul.thumbnails li').nth(2).find('a');
    const gallery = Selector('.mfp-wrap');
    const enlargedImage = Selector('.mfp-img');
    const imageCounter = Selector('.mfp-counter');
    const leftArrow = Selector('.mfp-arrow-left');
    const rightArrow = Selector('.mfp-arrow-right');

    // Click the second product image thumbnail (side view).
    await t.click(secondThumbnail);

    // Verify the enlarged image gallery opens.
    await t.expect(gallery.visible).ok();

    // Verify the enlarged product image is displayed.
    await t.expect(enlargedImage.visible).ok();

    // Verify the correct gallery image is selected.
    await t.expect(imageCounter.innerText).eql('3 of 3');

    // Click the left arrow and verify the second image is displayed.
    await t.click(leftArrow);
    await t.expect(imageCounter.innerText).eql('2 of 3');

    // Click the left arrow again and verify the first image is displayed.
    await t.click(leftArrow);
    await t.expect(imageCounter.innerText).eql('1 of 3');

    // Click the right arrow and verify the second image is displayed.
    await t.click(rightArrow);
    await t.expect(imageCounter.innerText).eql('2 of 3');

    // Click the right arrow again and verify the third image is displayed.
    await t.click(rightArrow);
    await t.expect(imageCounter.innerText).eql('3 of 3');
});
