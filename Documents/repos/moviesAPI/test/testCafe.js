import { Selector } from 'testcafe';

fixture `Client Functionality Tests`
    .page `http://127.0.0.1:8080/`; // Replace with your client's URL

// Test GET operation through UI
test('Test data retrieval', async t => {
    // Add your test code here
    // Example: Check if a list is populated
    await t
        .expect(Selector('#moviesTableBody').exists).ok()
        .expect(Selector('#moviesTableBody').childElementCount).gt(0, 'List has items');
});

// Test POST operation through UI
test('Test data creation', async t => {
    // Add your test code here
    // Example: Fill a form and submit
    await t
        .typeText('#name', 'New Movie')
        .typeText('#genre', 'sci-fi')
        .typeText('#releaseYear', '2023')
        .typeText('#rating', '7')
        // ... type in other fields ...
        .click('#submitBtn')
        .expect(Selector('#response-message').innerText).contains('success', 'Item created');
});

// Test PUT operation through UI
test('Test data update', async t => {
    // Add your test code here
    // Example: Edit an item
    await t
        .click(Selector('button').withText('Edit').nth(-1))    // Click on the first edit button
        .typeText('#name', 'Updated Movie', { replace: true })
        // ... update other fields ...
        .click('#updateBtn')
        .wait(1000)
        .expect(Selector('#response-message').innerText).contains('success', 'Item updated', { timeout: 5000 });

});

// Test DELETE operation through UI
// test('Test data deletion', async t => {
//     // Add your test code here
//     // Example: Delete an item
//     await t
//         .click(Selector('deleteBtn').nth(0)) // Click on the first delete button
//         .expect(Selector('#response-message').innerText).contains('success', 'Item deleted');
// });

test('Test data deletion', async t => {
    // Assuming that the delete button is the last button in a row.
    // This would click the delete button of the first movie in the list.
    await t
        .click(Selector('button').withText('Delete').nth(-2))
        .expect(Selector('#response-message').innerText).contains('success', 'Item deleted');
        // Add checks here for confirmation dialogs or messages if any
        // Add assertions here to verify that the movie was deleted
});
