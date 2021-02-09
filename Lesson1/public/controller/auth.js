import * as Element from "../viewpage/element.js";
import * as FirebaseController from "./firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "../viewpage/util.js";
import * as Routes from "./routes.js";

export let currentUser;

export function addEventListener() {
  Element.formSignin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = Element.formSignin.email.value;
    const password = Element.formSignin.password.value;

    const button = Element.formSignin.getElementsByTagName("button")[0]
    const originalLabel = Util.disableButton(button)

    try {
      await FirebaseController.signIn(email, password);
      //dismiss modal
      $("#" + Constant.IdmodalSigninForm).modal("hide");
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.popupInfo(
        "Sign in Error",
        JSON.stringify(e),
        Constant.IdmodalSigninForm
      );
    }

    Util.enableButton(button, originalLabel)
  });

  Element.menuSignout.addEventListener("click", async (e) => {
    try {
      await FirebaseController.signOut();
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.popupInfo("Sign out error", JSON.stringify(e));
    }
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      let elements = document.getElementsByClassName("modal-menus-pre-auth");
      for (let i = 0; i < elements.length; i++)
        elements[i].style.display = "none";
      elements = document.getElementsByClassName("modal-menus-post-auth");
      for (let i = 0; i < elements.length; i++)
        elements[i].style.display = "block";

      //more routing for page reloading
      const pathname = window.location.pathname;
      const href = window.location.href;
      Routes.routing(pathname, href);
    } else {
      currentUser = null;
      let elements = document.getElementsByClassName("modal-menus-pre-auth");
      for (let i = 0; i < elements.length; i++)
        elements[i].style.display = "block";
      elements = document.getElementsByClassName("modal-menus-post-auth");
      for (let i = 0; i < elements.length; i++)
        elements[i].style.display = "none";

      history.pushState(null, null, Routes.routePath.HOME);
    }
  });

  Element.formSignUp.addEventListener("submit", async e  => {
    e.preventDefault()
    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;

    //reset error messages
    const errorTags = document.getElementsByClassName("error-signup");
    for (let i = 0; i < errorTags.length; i++) {
      errorTags[i].innerHTML = "";
    }

    let valid = true; //determines if sign up is valid
    //email done with email html tag
    if (password.length < 6) {
      document.getElementById("signup-error-password").innerHTML =
        "password must be 6 chars";
      valid = false;
    }
    if (passwordConfirm != password) {
      document.getElementById("signup-error-passwordConfirm").innerHTML =
        "passwords must match";
      valid = false;
    }

    if (!valid) return;

    try {
      await FirebaseController.signUp(email, password);
      Util.popupInfo(
        "Account Created",
        "You are signed in now!",
        "modal-create-new-account"
      );
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.popupInfo(
        "Failed to create new account",
        JSON.stringify(e),
        "modal-create-new-account"
      );
    }
  });
}
