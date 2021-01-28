/* https://mariusschulz.com/blog/declaring-global-variables-in-typescript */
import { userConverter } from './models/User.js';
const firebase = window.firebase;
/**
 * Checks to see if the user is authorized to use our system.
 */
export async function isAuthorized(user) {
    try {
        const docRef = firebase.firestore().collection('authorized').doc(user.uid);
        const doc = await docRef.get();
        // console.log('>> role check', doc.data())
        if (doc.exists && doc.data().role === 'writer') {
            // console.log('Document data:', doc.data())
            console.log('>> authorization by role==="writer" check passed!', user.uid, doc.data().role);
            return true;
        }
        else {
            // doc.data() will be undefined in this case
            // console.log('No such document!')
            console.log('>> authorization by role==="writer" check failed!', user.uid);
            return false;
        }
    }
    catch (e) {
        console.log('isAuthorized(...) error:', e);
        return false;
    }
}
async function loadArticles() {
    const qs = await firebase.firestore().collection('articles').orderBy('datetime').limit(3).get();
    qs.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const o = doc.data();
        console.log(doc.id, ' => ', o.author, o.title);
    });
}
async function loadUser() {
    const doc = await firebase.firestore().collection('authorized').doc(firebase.auth().currentUser.uid)
        .withConverter(userConverter).get();
    const user = doc.data();
    console.log('## user fullname', user.fullname);
}
document.getElementById('test')
    .addEventListener('click', e => {
    loadUser();
});
window.onload = () => {
    console.log('lab02 loaded!');
    loadArticles();
};
