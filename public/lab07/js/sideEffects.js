/**
 * Import this file FIRST at the top of each page to inject all side effects into page.
 * This file sets:
 *  - The page title
 *  - The login bar
 *  - The navigation bar
 */
// Initialize page
export function initPage(pageTitle) {
    document.title = pageTitle;
    console.log('**** initPage() called!!!!!');
}
