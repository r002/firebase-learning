const firebase = window.firebase;
function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}
function getUserName() {
    return firebase.auth().currentUser.displayName;
}
// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
        return url + '?sz=150';
    }
    return url;
}
function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}
export function signInUser() {
    document.querySelector('#user').innerHTML = getUserName();
    userPicEl.removeAttribute('hidden');
    const profilePicUrl = getProfilePicUrl();
    userPicEl.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
}
export function signOut() {
    document.querySelector('#user').innerHTML = 'No user logged in!!!';
    if (firebase.auth().currentUser != null) {
        console.log('>> user signing out:', firebase.auth().currentUser.email);
    }
    userPicEl.setAttribute('hidden', 'true');
    userPicEl.style.backgroundImage = '';
    firebase.auth().signOut();
}
const userPicEl = document.getElementById('user-pic');
document.getElementById('sign-in').addEventListener('click', signIn);
document.getElementById('sign-out').addEventListener('click', signOut);
