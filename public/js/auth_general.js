function getProfilePicUrl () {
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png'
}

function getUserName () {
  return firebase.auth().currentUser.displayName
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic (url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150'
  }
  return url
}

// Initiate Firebase Auth.
function initFirebaseAuth () {
  firebase.auth().onAuthStateChanged(authStateObserver) // Listen to auth state changes.
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver (user) {
  if (user) { // User is successfully autenthicated by Google!
    // Once the user is authenticated against Google, check if the user is authorized.

    console.log('>> user successfully autenthicated by Google:', firebase.auth().currentUser.email)
    console.log('>> Now checking authorization...')

    isAuthorized(user).then(authorized => {
      // console.log('>> authorized', authorized)
      if (authorized) {
        signInUser(user)
      } else {
        // console.log("Sorry!!!  You're not authorized!", user.email)
        signOut()
      }
    })
  } else { // User is signed out!
    signOut()
  }
}

function signIn () {
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
}

function signInUser (user) {
  document.querySelector('#user').innerHTML = getUserName()
  userPicEl.removeAttribute('hidden')
  const profilePicUrl = getProfilePicUrl()
  userPicEl.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')'
}

function signOut () {
  document.querySelector('#user').innerHTML = 'No user logged in!!!'
  if (firebase.auth().currentUser != null) {
    console.log('>> user signing out:', firebase.auth().currentUser.email)
  }
  userPicEl.setAttribute('hidden', 'true')
  userPicEl.style.backgroundImage = ''
  firebase.auth().signOut()
}

const userPicEl = document.getElementById('user-pic')
document.getElementById('sign-in').addEventListener('click', signIn)
document.getElementById('sign-out').addEventListener('click', signOut)

// Initialize Firebase
initFirebaseAuth()
