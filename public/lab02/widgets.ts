import { Article, User } from './models.js'

/*
 * Accepts an array of Article objects and returns HTML
 * of an ArticleList to render.
 */
export function ArticleList (articles: Article[], user: User) : string {
  /*
   * Modify the 'actions palette' depending on the user's role.
   * (This is just for the GUI. We need to configure Firestore
   *  security rules too!)
   */
  return articles.reduce((acc, article) => {
    const actions = ['Read'] // All authorized users are the entitled 'Read' permission.

    if (user.role === 'admin') {
      actions.push('Edit')
      actions.push('Delete')
    } else if (user.role === 'writer' && user.id === article.uid) {
      actions.push('Edit')
      actions.push('Delete')
    }

    const actionsHtml = actions.reduce((acc, action) => {
      acc += `<button class='btnArticle' data-articleId='${article.id}' data-action='${action}'>
        ${action}</button> `
      return acc
    }, '')

    acc += `<h3>${article.title}</h3>
            <em>by ${article.author}</em><br />
            <strong>${(article.datetime).toDate()}</strong><br /><br />
            Tags: <strong>${article.tagsStr}</strong><br /><br />
            ---<br />
            <strong>Permissions: </strong>${actionsHtml}
            <hr />`
    return acc
  }, '<h2>Articles:</h2>')
}

/* Example of Event Delegation */
document.body.addEventListener('click', e => {
  // console.log('>> e.target', e.target)
  const el = e.target as HTMLElement
  if (el.className === 'btnArticle') {
    // console.log('this is a btnArticle class!!!!', el.getAttribute('data-articleId'),
    //   el.getAttribute('data-action'))
    handleArticleAction(el)
  };
})

function handleArticleAction (el: HTMLElement) : void {
  console.log('>> handleArticleAction', el.getAttribute('data-articleId'),
    el.getAttribute('data-action'))
}
