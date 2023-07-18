(along with chatgpt also)
Test Case: Searching for the root item

Enter the name of the root item, "rootDirectory," in the search field.
Verify that only the root item is displayed, and none of its children are visible.
Test Case: Full name search

Enter the name of another FS item, for example, "Directory3Level2," in the search field.
Verify that the item itself and all its parent items are displayed.
Verify that none of the other children from the fixture appear (Directory4Level3, File3Level3, and File4Level1 should not be visible).
Test Case: Partial name search

Use the same item as in Test Case 2 ("Directory3Level2").
Enter a partial name, such as "directory3," in the search field.
Verify that the item itself and all its parent items are displayed.
Verify that none of the other children from the fixture appear (Directory4Level3, File3Level3, and File4Level1 should not be visible).
Test Case: Partial name search (middle and end of the name)

Use the same item as in Test Case 2 ("Directory3Level2").
Enter "ry3lev" in the search field.
Verify that the item itself and all its parent items are displayed.
Verify that none of the other children from the fixture appear (Directory4Level3, File3Level3, and File4Level1 should not be visible).
Repeat the test with "3level2" as the search query and verify the same results.
Test Case: Clearing the search field

Perform a search using any of the previous test cases.
Clear the value in the search field (empty the search field).
Verify that all items are visible again, including the root item and its children.
Test Case: Testing edge cases and potential issues

Test with an empty search query and verify that all items are visible.
Test with special characters or symbols in the search query and ensure the search function handles them correctly.
Test with case sensitivity in the search query and verify that it works as expected (either case-insensitive or case-sensitive search).
Test with long search queries to check for performance issues or unexpected behavior.
Test with multiple concurrent search queries and ensure they don't interfere with each other.
Test with invalid search queries (null, undefined, or non-string values) and verify that the search function handles them gracefully.
