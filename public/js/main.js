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
  if (user) { // User is signed in!
    // Once the user is authenticated against Google, check if the user is authorized.

    isAuthorized(user).then(authorized => {
      console.log('>> authorized', authorized)
      if (authorized) {
        signInUser(user)
      } else {
        console.log("Sorry!!!  You're not authorized!", user.email)
        signOut()
      }
    })
  } else { // User is signed out!
    signOut()
  }
}

/**
 * Checks to see if the user is authorized to use our system.
 */
async function isAuthorized (user) {
  console.log('>> user', user)
  // console.log('>> user', user.email, user.uid, user)
  try {
    const docRef = firebase.firestore().collection('authorized').doc(user.uid)
    const doc = await docRef.get()
    if (doc.exists) {
      console.log('Document data:', doc.data())
      return true
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!')
      return false
    }
  } catch (e) {
    console.log('isAuthorized(...) error:', e)
    return false
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
  console.log('>> user signing out', firebase.auth().currentUser)
  userPicEl.setAttribute('hidden', 'true')
  userPicEl.style.backgroundImage = ''
  firebase.auth().signOut()
}

const userPicEl = document.getElementById('user-pic')

document.getElementById('sign-in').addEventListener('click', signIn)
document.getElementById('sign-out').addEventListener('click', signOut)
document.getElementById('btn-save-user')
  .addEventListener('click', e => {
    saveUser()
  })
document.getElementById('btn-update-user')
  .addEventListener('click', e => {
    updateUser()
  })

document.getElementById('btn-save-article')
  .addEventListener('click', e => {
    saveArticle()
  })

document.getElementById('btn-update-article')
  .addEventListener('click', e => {
    updateArticle()
  })

// Initialize Firebase
initFirebaseAuth()

/// ////////////////////////////

function saveArticle () {
  firebase.firestore().collection('articles').add({
    author: 'Diana Prince',
    email: 'diana@gmail.com',
    tags: ['Diversity', 'Team Dynamics'],
    datetime: firebase.firestore.FieldValue.serverTimestamp(),
    content: 'My article!!!!!!!!!!!!',
    uid: 'BN5nZuvERU0dzt7C9CCqoGbDFq4e'
  })
    .then(_ => {
      console.log('Document successfully written!')
    })
    .catch(error => {
      console.error('Error writing document: ', error)
    })
}

function updateArticle () {
  firebase.firestore().collection('articles').doc('6Va58mDcuErOOjcAlWDd').set({
    author: 'Clark Kent',
    uid: 'vhbDO15aDD0CjiWZrAOapjm3Jl5G',
    email: 'clark@gmail.com',
    tags: ['JLA', 'Avengers'],
    datetime: firebase.firestore.FieldValue.serverTimestamp(),
    content: 'This is the content of the article!!!!!'
  })
    .then(_ => {
      console.log('Document successfully written!')
    })
    .catch(error => {
      console.error('Error writing document: ', error)
    })
}

function saveUser () {
  firebase.firestore().collection('authorized').doc('vhbDO15aDD0CjiWZrAOapjm3Jl5G').set({
    email: 'clark@gmail.com',
    firstname: 'Clark',
    lastname: 'Kent',
    role: 'admin',
    logins: [firebase.firestore.Timestamp.now()]
  })
    .then(_ => {
      console.log('Document successfully written!')
    })
    .catch(error => {
      console.error('Error writing document: ', error)
    })
}

// function testSave () {
//   firebase.firestore().collection('authorized').doc('BN5nZuvERU0dzt7C9CCqoGbDFq4e').set({
//     email: 'diana@gmail.com',
//     firstname: 'Diana',
//     lastname: 'Prince',
//     logins: [firebase.firestore.Timestamp.now()]
//   })
//     .then(function () {
//       console.log('Document successfully written!')
//     })
//     .catch(function (error) {
//       console.error('Error writing document: ', error)
//     })
// }

function updateUser () {
  const userRef = firebase.firestore().collection('authorized').doc('BN5nZuvERU0dzt7C9CCqoGbDFq4e')
  userRef.update({
    logins: firebase.firestore.FieldValue.arrayUnion(firebase.firestore.Timestamp.now())
  })
}
