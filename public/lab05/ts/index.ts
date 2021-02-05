import './templateEngine.js'
import { triggerUserProfile } from './authUtil.js'
import init from './init.js'
import * as models from './models.js'
import { ArticleList } from './widgets.js'

init('{LAB_NO} | Index')

// Initialize Firebase
const firebase = (window as any).firebase
initFirebaseAuth()
function initFirebaseAuth () {
  firebase.auth().onAuthStateChanged(authStateObserver)
}

async function authStateObserver (user: any) : Promise<void> {
  if (user) {
    const userPrime: models.User | null = await triggerUserProfile(user)
    console.log('>>>>>> userPrime:', userPrime)
    if (userPrime) {
      renderArticles(userPrime)
      return
    }
  }
  emptyArticles()
}

async function loadArticles () : Promise<models.Article[]> {
  const qs = await firebase.firestore().collection('articles')
    .orderBy('datetime').limit(3)
    .withConverter(models.articleConverter).get()

  const articles = qs.docs.map((doc: any) => doc.data())
  return articles
}

let articlesMap: Map<string, models.Article>
async function renderArticles (userPrime: models.User) : Promise<void> {
  const articles = await loadArticles()
  // console.log('>> renderArticles()', articles)
  const arr = articles.reduce((acc: any, article: models.Article) => {
    return [...acc, [article.id, article]]
  }, [])
  articlesMap = new Map(arr)

  document.getElementById('articles')!
    .innerHTML = ArticleList(articles, userPrime)
}

function emptyArticles () : void {
  document.getElementById('articles')!
    .innerHTML = ''
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

  const articleId = el.getAttribute('data-articleId')!

  document.getElementById('reading-pane')!
    .innerHTML = articlesMap.get(articleId)!.content
}
