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
document.getElementById('btn-save')
  .addEventListener('click', e => {
    testSave()
  })
document.getElementById('btn-update')
  .addEventListener('click', e => {
    testUpdate()
  })

// initialize Firebase
initFirebaseAuth()

// if (location.hostname === 'localhost') {
//   firebase.functions().useEmulator('localhost', 5001)
//   firebase.firestore().useEmulator('localhost', 8080)
//   firebase.auth().useEmulator('http://localhost:9099/')
// }

/// ////////////////////////////

function testSave () {
  firebase.firestore().collection('authorized').doc('BN5nZuvERU0dzt7C9CCqoGbDFq4e').set({
    email: 'diana@gmail.com',
    firstname: 'Diana',
    lastname: 'Prince',
    logins: [firebase.firestore.Timestamp.now()]
  })
    .then(function () {
      console.log('Document successfully written!')
    })
    .catch(function (error) {
      console.error('Error writing document: ', error)
    })
}

function testUpdate () {
  const userRef = firebase.firestore().collection('authorized').doc('BN5nZuvERU0dzt7C9CCqoGbDFq4e')
  userRef.update({
    logins: firebase.firestore.FieldValue.arrayUnion(firebase.firestore.Timestamp.now())
  })
}
