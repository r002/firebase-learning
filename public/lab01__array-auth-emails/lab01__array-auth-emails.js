/* eslint-disable no-unused-vars */

/**
 * Checks to see if the user is authorized to use our system.
 */
async function isAuthorized (user) {
  // console.log('>> user', user.email)
  try {
    const auRef = firebase.firestore().collection('array_example')
    const qs = await auRef.where('writers', 'array-contains', user.email).get()
    // console.log('>> qs.size', qs.size)

    if (qs.size === 1) {
      // console.log('Query Snapshot resultset:', qs)
      console.log('>> authorization by email passed!', user.email)
      return true
    } else {
      // console.log('Array query returned empty!')
      console.log('>> authorization by email failed!', user.email)
      return false
    }
  } catch (e) {
    console.log('isAuthorized(...) error:', e)
    return false
  }
}

/* eslint-enable no-unused-vars */
