import './templateEngine.js';
import { triggerUserProfile } from './authUtil.js';
import init from './init.js';
import * as writer from './writer.js';
init('{LAB_NO} | The Editor - Part II');
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
        // if (userPrime) {
        //   renderArticles(userPrime)
        //   return
        // }
    }
    // emptyArticles()
}
let renderWindow;
// Runs on initial page load.
window.onload = () => {
    // console.log('>> Ready!')
    openRender();
};
function extractText() {
    const text = document.querySelector('#editor_view').value;
    // console.log('>> read text', text)
    const entry = writer.transformText(text);
    renderWindow.document.querySelector('#feed').innerHTML = writer.renderFeed(entry);
    renderWindow.document.querySelector('#render_view').innerHTML = writer.renderBody(entry);
}
// Only runs once upon initial page load.
function openRender() {
    renderWindow =
        window.open('render.html', 'renderTarget', 'height=1600,width=1600,status=yes,toolbar=no,menubar=no,location=no');
}
// This event hander will listen for messages from ALL child windows.
window.addEventListener('message', event => {
    // console.log('^^^^^^^^^ child message received!', event)
    if (event.data === 'Trigger from Renderman!')
        extractText();
}, false);
document.getElementById('editor_view')
    .addEventListener('keyup', e => {
    // console.log(">> key up", e)
    if (e.ctrlKey && e.key === 'Enter') {
        extractText();
    }
});
// // Currently commented. During dev, I frequently reload the 'render' page for testing.
// // Uncomment for production.
// window.onunload = () => {
//   console.log('>> closing children window if open.')
//   renderWindow?.close()
// }
