import * as models from './models.js'

const firebase = (window as any).firebase

function getProfilePicUrl () {
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png'
}

function getUserName () {
  return firebase.auth().currentUser.displayName
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic (url: string) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150'
  }
  return url
}

function signIn () {
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
}

function signInUser () {
  document.querySelector('#user')!.innerHTML = getUserName()
  userPicEl.removeAttribute('hidden')
  const profilePicUrl = getProfilePicUrl()
  userPicEl.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')'
}

function signOut () {
  document.querySelector('#user')!.innerHTML = 'No user logged in!!!'
  if (firebase.auth().currentUser != null) {
    console.log('>> user signing out:', firebase.auth().currentUser.email)
  }
  userPicEl.setAttribute('hidden', 'true')
  userPicEl.style.backgroundImage = ''
  firebase.auth().signOut()
}

const userPicEl = document.getElementById('user-pic')!
document.getElementById('sign-in')!.addEventListener('click', signIn)
document.getElementById('sign-out')!.addEventListener('click', signOut)

// export let USER: models.User

// Triggers when the auth state change for instance when the user signs-in or signs-out.
export async function triggerUserProfile (user: any) : Promise<models.User | null> {
  if (user) { // User is successfully autenthicated by Google!
    console.log('>> user successfully autenthicated by Google:', firebase.auth().currentUser.email)
    console.log('>> Now checking authorization...')

    const authorized = await isAuthorized(user)
    // console.log('>> authorized', authorized)
    if (authorized) {
      signInUser()
    } else {
      // console.log("Sorry!!!  You're not authorized!", user.email)
      signOut()
    }
    return authorized
  }
  signOut()
  return null
}

/**
 * Checks to see if the user is authorized to use our system.
 */
async function isAuthorized (user: any) : Promise<models.User | null> {
  try {
    const docRef = firebase.firestore().collection('authorized').doc(user.uid)
    const doc = await docRef.withConverter(models.userConverter).get()
    if (doc.exists) {
      // console.log('Document data:', doc.data())
      const userPrime: models.User = doc.data()
      console.log('>> authorization passed!', userPrime.id, models.Role[userPrime.role])

      renderUserProfile(userPrime)

      return userPrime
    } else {
      // doc.data() will be undefined in this case
      // console.log('No such document!')
      console.log('>> authorization check failed!', user.uid)
      return null
    }
  } catch (e) {
    console.log('isAuthorized(...) error:', e)
    return null
  }
}

function renderUserProfile (userPrime: models.User) : void {
  document.getElementById('userProfileBar')!
    .innerHTML = models.Role[userPrime.role]
}
