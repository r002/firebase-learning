/* https://mariusschulz.com/blog/declaring-global-variables-in-typescript */
import * as models from './models.js';
import { ArticleList } from './widgets.js';
import * as authUtil from './authUtil.js';
const firebase = window.firebase;
let USER;
// Initialize Firebase
initFirebaseAuth();
// Initiate Firebase Auth.
function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged(authStateObserver); // Listen to auth state changes.
}
// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
    if (user) { // User is successfully autenthicated by Google!
        // Once the user is authenticated against Google, check if the user is authorized.
        console.log('>> user successfully autenthicated by Google:', firebase.auth().currentUser.email);
        console.log('>> Now checking authorization...');
        isAuthorized(user).then(authorized => {
            // console.log('>> authorized', authorized)
            if (authorized) {
                authUtil.signInUser();
            }
            else {
                // console.log("Sorry!!!  You're not authorized!", user.email)
                authUtil.signOut();
            }
        });
    }
    else { // User is signed out!
        authUtil.signOut();
        emptyArticles();
    }
}
/**
 * Checks to see if the user is authorized to use our system.
 */
async function isAuthorized(user) {
    try {
        const docRef = firebase.firestore().collection('authorized').doc(user.uid);
        const doc = await docRef.withConverter(models.userConverter).get();
        if (doc.exists) {
            // console.log('Document data:', doc.data())
            USER = doc.data();
            console.log('>> authorization passed!', USER.id, models.Role[USER.role]);
            renderUserProfile();
            renderArticles();
            return true;
        }
        else {
            // doc.data() will be undefined in this case
            // console.log('No such document!')
            console.log('>> authorization check failed!', user.uid);
            return false;
        }
    }
    catch (e) {
        console.log('isAuthorized(...) error:', e);
        return false;
    }
}
function renderUserProfile() {
    document.getElementById('userProfileBar')
        .innerHTML = models.Role[USER.role];
}
/* https://stackoverflow.com/questions/52100103/getting-all-documents-from-one-collection-in-firestore */
async function loadArticles() {
    const qs = await firebase.firestore().collection('articles')
        .orderBy('datetime').limit(3)
        .withConverter(models.articleConverter).get();
    const articles = qs.docs.map((doc) => doc.data());
    return articles;
}
let articlesMap;
async function renderArticles() {
    const articles = await loadArticles();
    // console.log('>> renderArticles()', articles)
    const arr = articles.reduce((acc, article) => {
        return [...acc, [article.id, article]];
    }, []);
    articlesMap = new Map(arr);
    document.getElementById('articles')
        .innerHTML = ArticleList(articles, USER);
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
