/* eslint-disable no-unused-vars */

/**
 * Checks to see if the user is authorized to use our system.
 */
async function isAuthorized (user) {
  try {
    const docRef = firebase.firestore().collection('authorized').doc(user.uid)
    const doc = await docRef.get()
    // console.log('>> role check', doc.data())
    if (doc.exists && doc.data().role === 'writer') {
      // console.log('Document data:', doc.data())
      console.log('>> authorization by role==="writer" check passed!', user.uid, doc.data().role)
      return true
    } else {
      // doc.data() will be undefined in this case
      // console.log('No such document!')
      console.log('>> authorization by role==="writer" check failed!', user.uid)
      return false
    }
  } catch (e) {
    console.log('isAuthorized(...) error:', e)
    return false
  }
}

/* eslint-enable no-unused-vars */
