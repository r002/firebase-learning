/* eslint-disable no-unused-vars */

/**
 * Checks to see if the user is authorized to use our system.
 */
async function isAuthorized (user) {
  try {
    const docRef = firebase.firestore().collection('authorized').doc(user.uid)
    const doc = await docRef.get()
    if (doc.exists) {
      // console.log('Document data:', doc.data())
      console.log('>> authorization by role-check passed!', user.uid)
      return true
    } else {
      // doc.data() will be undefined in this case
      // console.log('No such document!')
      console.log('>> authorization by role-check failed!', user.uid)
      return false
    }
  } catch (e) {
    console.log('isAuthorized(...) error:', e)
    return false
  }
}

/* eslint-enable no-unused-vars */
