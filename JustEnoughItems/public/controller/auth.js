import * as Element from "../viewpage/element.js";
import * as FirebaseController from "./firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "../viewpage/util.js";
import * as Routes from "./routes.js";
import * as Home from "../viewpage/home_page.js";
import * as Profile from "../viewpage/profile_page.js";

export let currentUser;
export let isAdmin;

export function addEventListeners() {
  Element.formSignin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await FirebaseController.signIn(email, password);
      //console.log(isAdmin)
      $("#modal-form-signin").modal("hide");
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.popupInfo("Sign in errer", JSON.stringify(e), "modal-form-signin");
    }
  });

  Element.menuButtonSignout.addEventListener("click", async () => {
    try {
      await FirebaseController.signOut();
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.popupInfo("Sign out error", JSON.stringify(e));
    }
  });

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      currentUser = user;
      Home.getShoppingCartFromLocalStorage();

      isAdmin = await FirebaseController.isAdmin(currentUser.email);

      const accountInfo = await FirebaseController.getAccountInfo(user.uid);
      Profile.setProfileIcon(accountInfo.photoURL);

      let elements = document.getElementsByClassName("modal-pre-auth");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
      }
      elements = document.getElementsByClassName("modal-post-auth");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
      }

      if (isAdmin) {
        elements = document.getElementsByClassName("modal-admin-auth");
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = "block";
        }
      }

      const path = window.location.pathname;
      Routes.routing(path);
    } else {
      currentUser = null;
      isAdmin = false;
      let elements = document.getElementsByClassName("modal-pre-auth");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
      }
      elements = document.getElementsByClassName("modal-post-auth");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
      }

      elements = document.getElementsByClassName("modal-admin-auth");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
      }

      history.pushState(null, null, Routes.routePathname.HOME);
      const path = window.location.pathname;
      Routes.routing(path);
    }
  });

  Element.buttonSignup.addEventListener("click", () => {
    //show sign up modal
    $("#modal-form-signin").modal("hide");
    Element.formSignup.reset();
    $("#modal-form-signup").modal("show");
  });

  Element.formSignup.addEventListener("submit", (e) => {
    e.preventDefault();
    sign_up(e.target);
  });
}

async function sign_up(form) {
  const email = form.email.value;
  const password = form.password.value;
  const passwordConfirm = form.passwordConfirm.value;

  Element.formSignupPasswordError.innerHTML = "";
  if (password != passwordConfirm) {
    Element.formSignupPasswordError.innerHTML = "Two passwords do not match";
    return;
  }

  try {
    await FirebaseController.createUser(email, password);
    Util.popupInfo(
      "Account Created",
      "You are now signed in",
      "modal-form-signup"
    );
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("Create User Error", JSON.stringify(e), "modal-form-signup");
  }
}
