/**
 * Import this file FIRST at the top of each page to inject all side effects into page.
 * This file sets:
 *  - The page title
 *  - The login bar
 *  - The navigation bar
 */

const LAB_NO = 'Lab05'

/**
 * Set the page title.
 * @param pageTitle - The title of the HTML page you wish to set.
 */
export default function (pageTitle: string) : void {
  const title = pageTitle.replace('{LAB_NO}', LAB_NO)
  document.title = title
  document.querySelector('#title')!.innerHTML = title
  // console.log('**** initPage() called!!!!!')
}
