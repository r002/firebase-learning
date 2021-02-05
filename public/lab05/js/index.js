import './templateEngine.js';
import { triggerUserProfile } from './authUtil.js';
import init from './init.js';
import * as models from './models.js';
import { ArticleList } from './widgets.js';
init('{LAB_NO} | Index');
// Initialize Firebase
const firebase = window.firebase;
initFirebaseAuth();
function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged(authStateObserver);
}
async function authStateObserver(user) {
    if (user) {
        const userPrime = await triggerUserProfile(user);
        console.log('>>>>>> userPrime:', userPrime);
        if (userPrime) {
            renderArticles(userPrime);
            return;
        }
    }
    emptyArticles();
}
async function loadArticles() {
    const qs = await firebase.firestore().collection('articles')
        .orderBy('datetime').limit(3)
        .withConverter(models.articleConverter).get();
    const articles = qs.docs.map((doc) => doc.data());
    return articles;
}
let articlesMap;
async function renderArticles(userPrime) {
    const articles = await loadArticles();
    // console.log('>> renderArticles()', articles)
    const arr = articles.reduce((acc, article) => {
        return [...acc, [article.id, article]];
    }, []);
    articlesMap = new Map(arr);
    document.getElementById('articles')
        .innerHTML = ArticleList(articles, userPrime);
}
function emptyArticles() {
    document.getElementById('articles')
        .innerHTML = '';
}
/* Example of Event Delegation */
document.body.addEventListener('click', e => {
    // console.log('>> e.target', e.target)
    const el = e.target;
    if (el.className === 'btnArticle') {
        // console.log('this is a btnArticle class!!!!', el.getAttribute('data-articleId'),
        //   el.getAttribute('data-action'))
        handleArticleAction(el);
    }
    ;
});
function handleArticleAction(el) {
    console.log('>> handleArticleAction', el.getAttribute('data-articleId'), el.getAttribute('data-action'));
    const articleId = el.getAttribute('data-articleId');
    document.getElementById('reading-pane')
        .innerHTML = articlesMap.get(articleId).content;
}
