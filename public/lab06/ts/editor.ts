import './templateEngine.js'
import { triggerUserProfile } from './authUtil.js'
import init from './init.js'
import * as models from './models.js'
import * as nginw from './nginw.js'

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
    console.log('>>>>>> userPrime:', userPrime)
    // if (userPrime) {
    //   renderArticles(userPrime)
    //   return
    // }
  }
  // emptyArticles()
}

let renderWindow: Window | null

// Runs on initial page load.
window.onload = () => {
  // console.log('>> Ready!')
  openRender()
}

function extractText () : void {
  const text: string = (<HTMLTextAreaElement>document.querySelector('#editor_view')).value
  // console.log('>> read text', text)
  const entry: models.Entry = nginw.transformText(text)
  renderWindow!.document.querySelector('#feed')!.innerHTML = nginw.renderFeed(entry)
  renderWindow!.document.querySelector('#render_view')!.innerHTML = nginw.renderBody(entry)
  document.querySelector('#bodyWordCount')!.innerHTML = entry.wordCount.toString()
}

// Only runs once upon initial page load.
function openRender () : void {
  renderWindow =
    window.open('render.html', 'renderTarget',
      'height=1600,width=1600,status=yes,toolbar=no,menubar=no,location=no')
}

/**
 * GLOBAL ARTICLE OBJECT -- Rethink this design? 2/8/21
 */
let cachedArticle: models.Article

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
    'GiipCFnTbE8', // default movie
    'createNewArticle title!!!!!!!!!',
    'uncategorized',
    ['aaaa tag1', 'bbb tag2'],
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

/**
 * Saves article in Editor to Firestore.
 */
function saveArticle () : void {
  const editorText: string = (<HTMLTextAreaElement>document.getElementById('editor_view')).value
  const editorArticle: any = nginw.parseText(editorText)

  // Overwrite specific fields with new fields from Editor.
  cachedArticle.title = editorArticle.title
  cachedArticle.content = editorArticle.content

  firebase.firestore().collection('articles').doc(cachedArticle.id
  )
    .withConverter(models.articleConverter)
    .set(cachedArticle)
}

function loadArticle () : void {
  firebase.firestore().collection('articles').doc('ETLWxrauv2QBbDB4pa9T')
    .withConverter(models.articleConverter).get()
    .then((doc: any) => {
      const article: models.Article = doc.data()
      populateEditor(article)
    })
}

document.getElementById('btnCreateNewArticle')!.addEventListener('click', createNewArticle)
document.getElementById('btnSaveArticle')!.addEventListener('click', saveArticle)
document.getElementById('btnLoadArticle')!.addEventListener('click', loadArticle)

document.getElementById('editor_view')!
  .addEventListener('keyup', e => {
    // console.log(">> key up", e)
    if (e.ctrlKey && e.key === 'Enter') {
      extractText()
    }
  })

// This event hander will listen for messages from ALL child windows.
window.addEventListener('message', event => {
  // console.log('^^^^^^^^^ child message received!', event)
  if (event.data === 'Trigger from Renderman!') extractText()
}, false)

// // Currently commented. During dev, I frequently reload the 'render' page for testing.
// // Uncomment for production.
// window.onunload = () => {
//   console.log('>> closing children window if open.')
//   renderWindow?.close()
// }
