document.querySelector('#loginBar')!.innerHTML = renderLoginBar()
/**
 * Renders the login bar.
 */
function renderLoginBar () : string {
  return `
    Logged in:  <strong><span id="user">No user logged in.</span></strong>
    <div hidden id="user-pic"></div> 
    <br />Role: <strong><span id="userProfileBar"></span></strong>
    <br /><br />

    <button id="sign-in">
        Sign-in with Google!
    </button>
    <br /><br />

    <button id="sign-out">
        Sign-out with Google!
    </button>
    <br /><br />
  `
}
