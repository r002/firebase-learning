/* https://mariusschulz.com/blog/declaring-global-variables-in-typescript */
import * as models from './models.js';
import { ArticleList } from './widgets.js';
const firebase = window.firebase;
let USER;
/**
 * Checks to see if the user is authorized to use our system.
 */
export async function isAuthorized(user) {
    try {
        const docRef = firebase.firestore().collection('authorized').doc(user.uid);
        const doc = await docRef.withConverter(models.userConverter).get();
        // console.log('>> role check', doc.data())
        if (doc.exists) {
            // console.log('Document data:', doc.data())
            USER = doc.data();
            console.log('>> authorization passed!', USER.id, USER.role);
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
/* https://stackoverflow.com/questions/52100103/getting-all-documents-from-one-collection-in-firestore */
async function loadArticles() {
    const qs = await firebase.firestore().collection('articles')
        .orderBy('datetime').limit(3)
        .withConverter(models.articleConverter).get();
    const articles = qs.docs.map((doc) => doc.data());
    console.log('#### articles', articles[0].tagsStr, articles);
    return articles;
}
async function renderArticles() {
    const articles = await loadArticles();
    console.log('>> renderArticles()', articles);
    document.getElementById('articles')
        .innerHTML = ArticleList(articles, USER.role);
}
// function emptyArticles () : void {
//   document.getElementById('articles')!
//     .innerHTML = ''
// }
async function loadUser() {
    const doc = await firebase.firestore().collection('authorized')
        .doc(firebase.auth().currentUser.uid)
        .withConverter(models.userConverter).get();
    const user = doc.data();
    console.log('## user fullname', user.fullname);
}
/* https://stackoverflow.com/questions/40640663/strictnullchecks-and-getelementbyid */
document.getElementById('test')
    .addEventListener('click', e => {
    loadUser();
});
// window.onload = () => {
//   console.log('lab02 loaded!!!!')
//   renderArticles()
//   console.log('---------- Finished! -----------')
// }
