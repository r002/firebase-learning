import './templateEngine.js'
import { triggerUserProfile } from './authUtil.js'
import init from './init.js'
import * as models from './models.js'
import * as nginw from './nginw.js'
import { ArticleQuickList } from './widgets.js'

init('{LAB_NO} | The Editor - Part II')

// Initialize Firebase
const firebase = (window as any).firebase
initFirebaseAuth()
function initFirebaseAuth () {
  firebase.auth().onAuthStateChanged(authStateObserver)
}

async function authStateObserver (user: any) : Promise<void> {
  if (user) {
    const userPrime: models.User | null = await triggerUserProfile(user)
    // console.log('>>>>>> userPrime:', userPrime)
    if (userPrime) {
      loadArticleQuickList()
      // return
    }
  }
  // emptyArticles()
}

let renderWindow: Window | null

// Runs on initial page load.
window.onload = () => {
  // console.log('>> Ready!')
  openRender()
}

/**
 * GLOBAL ARTICLES MAP OBJECT -- Rethink this design? 2/8/21
 * GLOBAL ARTICLE OBJECT -- Rethink this design? 2/8/21
 */
let articlesMap: Map<string, models.Article>
let cachedArticle: models.Article

/**
 * Loads article title buttons.
 */
async function loadArticleQuickList () : Promise<void> {
  const qs = await firebase.firestore().collection('articles')
    .where('uid', '==', firebase.auth().currentUser.uid)
    .orderBy('datetime').limit(5)
    .withConverter(models.articleConverter).get()
  const articles = qs.docs.map((doc: any) => doc.data())
  const arr = articles.reduce((acc: any, article: models.Article) => {
    return [...acc, [article.id, article]]
  }, [])
  articlesMap = new Map(arr)
  document.getElementById('articleQuickList')!.innerHTML = ArticleQuickList(articles)
}

/**
 * Extracts the text in the Editor, formats it, and renders the text in the Renderman window.
 */
function renderEditorText () : void {
  const text: string = (<HTMLTextAreaElement>document.getElementById('editor_view')).value
  // console.log('>> editor_view text:', text)
  const entry: models.Entry = nginw.transformText(text)
  renderWindow!.document.querySelector('#feed')!.innerHTML = nginw.renderFeed(entry)
  renderWindow!.document.querySelector('#render_view')!.innerHTML = nginw.renderArticle(entry)
  document.querySelector('#bodyWordCount')!.innerHTML = entry.wordCount.toString()
  document.querySelector('#headingsCount')!.innerHTML = entry.headingsCount.toString()
}

/**
 * Saves article in Editor to Firestore.
 */
function saveArticle () : void {
  const editorText: string = (<HTMLTextAreaElement>document.getElementById('editor_view')).value
  const editorArticle: any = nginw.parseText(editorText)

  // Overwrite specific fields with new fields from Editor.
  cachedArticle.song = editorArticle.song
  cachedArticle.movie = editorArticle.movie
  cachedArticle.title = editorArticle.title
  cachedArticle.content = editorArticle.content

  firebase.firestore().collection('articles').doc(cachedArticle.id)
    .withConverter(models.articleConverter)
    .set(cachedArticle)

  renderEditorText()
  loadArticleQuickList()
}

/**
 * Populates the GUI editor with contents of an Article.
 *
 * @param article
 */
function populateEditor (article: models.Article) : void {
  cachedArticle = article
  const s: string = '' +
// `<id>${article.id}</id>` +
// `<author>${article.author}</author>` +
// `<uid>${article.uid}</uid>` +
// `<email>${article.email}</email>` +
`<song>${article.song}</song>
<movie>${article.movie}</movie>
<title>${article.title}</title>
<category>${article.category}</category>
<tags>${article.tags.join(', ')}</tags>
<datetime>${article.datetime}</datetime>

${article.content}
`
  // Prepending ';' needed because of cast!
  ;(<HTMLTextAreaElement>document.getElementById('editor_view')).value = s
  renderEditorText()
}

function createNewArticle () : void {
  const defaultContent: string = '' +
`### Introduction

An example of _italicized text!_ Formatting is _easy!_
Here is an example of **bolded text**. Pretty **cool**, right?
Is it possible to do both? **_Sure it is!_** No problem!
Does _**order matter?**_ Nope!`

  const article = new models.Article(
    'dummy article id - to be replaced by Firestore',
    firebase.auth().currentUser.displayName,
    firebase.auth().currentUser.uid,
    firebase.auth().currentUser.email,
    'AdW6BBF22AY', // default song
    '0WWzgGyAH6Y', // default movie
    'New Article Title',
    'Uncategorized',
    ['Tag01', 'Tag02'],
    defaultContent,
    firebase.firestore.FieldValue.serverTimestamp()
  )

  firebase.firestore().collection('articles')
    .withConverter(models.articleConverter)
    .add(article)
    .then((docRef: any) => {
      article.id = docRef.id
      article.datetime = new Date() // Only on new article creation, overwrite 'datetime'
      console.log('>> doc added!', docRef.id, article)
      populateEditor(article)
    })
}

// function loadArticle () : void {
//   firebase.firestore().collection('articles').doc('ETLWxrauv2QBbDB4pa9T')
//     .withConverter(models.articleConverter).get()
//     .then((doc: any) => {
//       const article: models.Article = doc.data()
//       populateEditor(article)
//     })
// }

/**
 * Opens Renderman window.
 * Only runs once upon initial page load.
 */
function openRender () : void {
  renderWindow =
    window.open('render.html', 'renderTarget',
      'height=1600,width=1600,status=yes,toolbar=no,menubar=no,location=no')
}

/* Example of Event Delegation */
document.body.addEventListener('click', e => {
  // console.log('>> e.target', e.target)
  const el = e.target as HTMLElement
  if (el.className === 'btnQuickArticle') {
    // console.log('this is a btnArticle class!!!!', el.getAttribute('data-articleId'),
    //   el.getAttribute('data-action'))
    handleArticleAction(el)
  };
})

function handleArticleAction (el: HTMLElement) : void {
  // console.log('>> handleArticleAction', el.getAttribute('data-articleId'))
  const articleId = el.getAttribute('data-articleId')!
  populateEditor(articlesMap.get(articleId)!)
}

document.getElementById('btnCreateNewArticle')!.addEventListener('click', createNewArticle)
document.getElementById('btnSaveArticle')!.addEventListener('click', saveArticle)
// document.getElementById('btnLoadArticle')!.addEventListener('click', loadArticle)

document.getElementById('editor_view')!
  .addEventListener('keyup', e => {
    // console.log(">> key up", e)
    if (e.ctrlKey && e.key === 'Enter') {
      renderEditorText()
      saveArticle()
    }
  })

// This event hander will listen for messages from ALL child windows.
window.addEventListener('message', event => {
  // console.log('^^^^^^^^^ child message received!', event)
  if (event.data === 'Trigger from Renderman!') renderEditorText()
}, false)

// // Currently commented. During dev, I frequently reload the 'render' page for testing.
// // Uncomment for production.
// window.onunload = () => {
//   console.log('>> closing children window if open.')
//   renderWindow?.close()
// }
