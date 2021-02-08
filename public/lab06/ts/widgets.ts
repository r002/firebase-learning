import { Article, User, Role } from './models.js'

/*
 * Accepts an array of Article objects and returns HTML
 * of an ArticleList to render.
 */
export function ArticleList (articles: Article[], user: User) : string {
  return articles.reduce((acc, article, i) => {
    /*
     * Modify the 'actions palette' depending on the user's role.
     * (This is just for the GUI. We need to configure Firestore
     *  security rules too!)
     */
    const actionsBuilder = (role: Role, uid: string, auid: string) => {
      if (role === Role.admin) return ['Read', 'Edit', 'Delete']
      else if (role === Role.writer && uid === auid) return ['Read', 'Edit', 'Delete']
      else return ['Read']
    }
    const actions = actionsBuilder(user.role, user.id, article.uid)

    const actionsHtml = actions.reduce((acc, action) => {
      return acc + `<button class='btnArticle' data-articleId='${article.id}' 
              data-action='${action}'>${action}</button> `
    }, '')

    return acc + `<h3>${i} | ${article.title}</h3>
            <em>by ${article.author}</em><br />
            <strong>${article.datetime}</strong><br />
            ---<br />
            <strong>Permissions: </strong>${actionsHtml}
            <hr />`
  }, '<h2>Articles:</h2>')
}

export function ReadingPane () {

}
