/* https://mariusschulz.com/blog/declaring-global-variables-in-typescript */
import * as models from './models.js'
import * as authUtil from './authUtil.js'

const firebase = (window as any).firebase
let USER: models.User

// Initialize Firebase
initFirebaseAuth()

// Initiate Firebase Auth.
function initFirebaseAuth () {
  firebase.auth().onAuthStateChanged(authStateObserver) // Listen to auth state changes.
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver (user: any) {
  if (user) { // User is successfully autenthicated by Google!
    // Once the user is authenticated against Google, check if the user is authorized.
    console.log('>> user successfully autenthicated by Google:', firebase.auth().currentUser.email)
    console.log('>> Now checking authorization...')

    isAuthorized(user).then(authorized => {
      // console.log('>> authorized', authorized)
      if (authorized) {
        authUtil.signInUser()
      } else {
        // console.log("Sorry!!!  You're not authorized!", user.email)
        authUtil.signOut()
      }
    })
  } else { // User is signed out!
    authUtil.signOut()
  }
}

/**
 * Checks to see if the user is authorized to use our system.
 */
async function isAuthorized (user: any) {
  try {
    const docRef = firebase.firestore().collection('authorized').doc(user.uid)
    const doc = await docRef.withConverter(models.userConverter).get()
    if (doc.exists) {
      // console.log('Document data:', doc.data())
      USER = doc.data()
      console.log('>> authorization passed!', USER.id, models.Role[USER.role])

      renderUserProfile()

      return true
    } else {
      // doc.data() will be undefined in this case
      // console.log('No such document!')
      console.log('>> authorization check failed!', user.uid)
      return false
    }
  } catch (e) {
    console.log('isAuthorized(...) error:', e)
    return false
  }
}

function renderUserProfile () : void {
  document.getElementById('userProfileBar')!
    .innerHTML = models.Role[USER.role]
}
