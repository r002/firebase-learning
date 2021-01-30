import { Article } from './models.js'

/*
 * Accepts an array of Article objects and returns HTML
 * of an ArticleList to render.
 */
export function ArticleList (articles: Article[], role: string) : string {
  /*
   * Modify the 'command pallete' depending on the user's role.
   * (This is just for the GUI. We need to configure Firestore
   *  security rules too!)
   */

  return articles.reduce((acc, article) => {
    acc += `<h3>${article.title}</h3>
            <em>by ${article.author}</em><br />
            <strong>${(article.datetime).toDate()}</strong><br />
            ${role}
            <hr />`
    return acc
  }, '')
}
