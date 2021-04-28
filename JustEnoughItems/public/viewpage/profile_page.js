import * as Element from "./element.js";
import * as Auth from "../controller/auth.js";
import * as Routes from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import * as Constant from "../model/constant.js";

export function addEventListeners() {
  Element.menuButtonProfile.addEventListener("click", async (e) => {
    history.pushState(null, null, Routes.routePathname.PROFILE);
    e.preventDefault();
    const label = Util.disableButton(Element.menuButtonProfile);
    await profile_page();
    Util.enableButton(Element.menuButtonProfile, label);
  });
}

export async function profile_page() {
  if (!Auth.currentUser) {
    Element.mainContent.innerHTML = "<h1>Protected Page</h1>";
    return;
  }

  /*let accountInfo;
  try {
    accountInfo = await FirebaseController.getAccountInfo(Auth.currentUser.uid);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("Cannot retrieve account info", JSON.stringify(e));
  }*/

  profilePage(Auth.currentUser.uid, Auth.currentUser.email);
}

export async function profilePage(uid, email) {
  let accountInfo

  try {
    accountInfo = await FirebaseController.getAccountInfo(uid);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("Cannot retrieve account info", JSON.stringify(e));
  }
    
  let html = `<h1>Profile Page</h1>`;

  html += `
        <div class="alert alert-primary ${
          email == Auth.currentUser.email ? "d-block" : "d-none"
        }">
            Email: ${Auth.currentUser.email} (cannot change email as login name)
        </div>
        <form id="profile-name" class="form-profile-update" method="post">
            <table class="table table-sm">
            <tr>
                <td width="15%">Name:</td>
                <td width="60%">
                    <input type="text" name="name" value="${
                      accountInfo.name
                    }" placeholder="firstname lastname" disabled required pattern="^[A-Za-z][A-Za-z|'|-| ]+">
                </td>
                <td>
                    <div class="${
                      email == Auth.currentUser.email ? "d-block" : "d-none"
                    }">${actionButtons()}</div>
                </td>
            </tr>
            </table>
        </form>
        <form id="profile-address" class="form-profile-update ${
          email == Auth.currentUser.email ? "d-block" : "d-none"
        }" method="post">
            <table class="table table-sm">
            <tr>
                <td width="15%">Address:</td>
                <td width="60%">
                    <input type="text" name="address" value="${
                      accountInfo.address
                    }" placeholder="Address" disabled required minlength="2">
                </td>
                <td>
                   <div class="${
                     email == Auth.currentUser.email ? "d-block" : "d-none"
                   }">${actionButtons()}</div>
                </td>
            </tr>
            </table>
        </form>
        <form id="profile-city" class="form-profile-update" method="post">
            <table class="table table-sm">
            <tr>
                <td width="15%">City:</td>
                <td width="60%">
                    <input type="text" name="city" value="${
                      accountInfo.city
                    }" placeholder="City" disabled required minlength="2">
                </td>
                <td>
                   <div class="${
                     email == Auth.currentUser.email ? "d-block" : "d-none"
                   }">${actionButtons()}</div>
                </td>
            </tr>
            </table>
        </form>
        <form id="profile-state" class="form-profile-update" method="post">
            <table class="table table-sm">
            <tr>
                <td width="15%">State:</td>
                <td width="60%">
                    <input type="text" name="state" value="${
                      accountInfo.state
                    }" placeholder="State (2 Uppercase Letter Code)" disabled required pattern="[A-Z]+" minlength="2" maxlength="2">
                </td>
                <td>
                    <div class="${
                      email == Auth.currentUser.email ? "d-block" : "d-none"
                    }">${actionButtons()}</div>
                </td>
            </tr>
            </table>
        </form>
        <form id="profile-zip" class="form-profile-update ${
          email == Auth.currentUser.email ? "d-block" : "d-none"
        }" method="post">
            <table class="table table-sm">
            <tr>
                <td width="15%">Zip:</td>
                <td width="60%">
                    <input type="number" name="zip" value="${
                      accountInfo.zip
                    }" placeholder="ZIP (5 Digit Zip)" disabled required min="10000" max="99999">
                </td>
                <td>
                   <div class="${
                     email == Auth.currentUser.email ? "d-block" : "d-none"
                   }">${actionButtons()}</div>
                </td>
            </tr>
            </table>
        </form>
        <form id="profile-creditCardNo" class="form-profile-update ${
          email == Auth.currentUser.email ? "d-block" : "d-none"
        }" method="post">
            <table class="table table-sm">
            <tr>
                <td width="15%">Credit Card#:</td>
                <td width="60%">
                    <input type="text" name="creditCardNo" value="${
                      accountInfo.creditCardNo
                    }" placeholder="16 digit card #" disabled required pattern="[0-9]+" minlength="16" maxlength="16">
                </td>
                <td>
                   ${actionButtons()}
                </td>
            </tr>
            </table>
        </form>
        <table>
            <tr>
                <td>
                <div class="${
                  email == Auth.currentUser.email ? "d-block" : "d-none"
                }">
                    <input type="file" id="profile-photo-button" value="upload">
                    </div>
                </td>
                <td>
                    <img id="profile-photo-tag" class="rounded-circle" width="250px" src="${
                      accountInfo.photoURL
                    }">
                </td>
                <td>
                    <div class="${
                      email == Auth.currentUser.email ? "d-block" : "d-none"
                    }">
                    <button id="profile-photo-update-button" class="btn btn-outline-danger">Update Photo</button>
                    </div>
                </td>
            </tr>
        </table>
    `;

  html += "<br><br><h1>Reviews</h1>";
  let comments = [];
  try {
    comments = await FirebaseController.getUserComments(email);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("Cannot retrieve user comments", JSON.stringify(e));
  }

  comments.forEach((comment) => {
    html += `
     <form class="review-item" method="post">
            <table class="table table-sm">
            <tr>
                <td width="15%">Posted on: <br>${new Date(
                  comment.timestamp
                ).toString()}</td>
                <td width="5%">Product: ${comment.name}</td>
                <td width="60%"> 
                <span>Review:</span>
                <input id="comment-content-${
                  comment.docId
                }" type="text" name="Comment" disabled required minlength=5 value="${
      comment.content
    }">
                <input type="hidden" name="docId" value="${comment.docId}">
                </td>
            </tr>
            </table>
        
    `;
    if (Auth.currentUser.email == comment.email) {
      html += `
        <button onclick="this.form.submitter='Delete'" type="submit" class="btn btn-outline-primary">Delete</button>
        <button onclick="this.form.submitter='Edit'" type="submit" class="btn btn-outline-primary ">Edit</button>
        <button onclick="this.form.submitter='Update'" type="submit" class="btn btn-outline-danger " style="display:none;">Update</button>
        <button onclick="this.form.submitter='Cancel'" type="submit" class="btn btn-outline-secondary " formnovalidate="true" style="display:none;">Cancel</button>
        </form>`;
    }
    html += `<hr></div><br>`;
  });

  Element.mainContent.innerHTML = html;

  let photoProfile;

  document
    .getElementById("profile-photo-button")
    .addEventListener("change", (e) => {
      photoProfile = e.target.files[0];
      if (!photoProfile) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () =>
        (document.getElementById("profile-photo-tag").src = reader.result);
      reader.readAsDataURL(photoProfile);
    });

  const updatePhotoButton = document.getElementById(
    "profile-photo-update-button"
  );
  updatePhotoButton.addEventListener("click", async () => {
    if (!photoProfile) {
      Util.popupInfo("No photo selected", "Please choose a profile photo");
    }
    const label = Util.disableButton(updatePhotoButton);
    try {
      const photoURL = await FirebaseController.uploadProfilePhoto(
        photoProfile,
        Auth.currentUser.uid
      );
      await FirebaseController.updateAccountInfo(Auth.currentUser.uid, {
        photoURL,
      });
      setProfileIcon(photoURL);
      Util.popupInfo("Success", "Profile Photo updated");
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.popupInfo("Error updating photo", JSON.stringify(e));
    }
    Util.enableButton(updatePhotoButton, label);
  });

  const forms = document.getElementsByClassName("form-profile-update");
  for (let i = 0; i < forms.length; i++) {
    forms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      //const buttonLabel = e.submitter.innerHTML     not compatible
      const buttonLabel = e.target.submitter;
      const buttons = e.target.getElementsByTagName("button");
      const inputTag = e.target.getElementsByTagName("input")[0];
      const key = inputTag.name;
      const value = inputTag.value;
      if (buttonLabel == "Edit") {
        //edit button
        buttons[0].style.display = "none";
        buttons[1].style.display = "inline-block";
        buttons[2].style.display = "inline-block";
        inputTag.disabled = false;
      } else if (buttonLabel == "Update") {
        //update button
        try {
          const update = {};
          update[key] = value;
          await FirebaseController.updateAccountInfo(
            Auth.currentUser.uid,
            update
          );
          accountInfo[key] = value;
        } catch (e) {
          if (Constant.DEV) console.log(e);
          Util.popupInfo(`Update ${key} error`, JSON.stringify(e));
        }
        buttons[0].style.display = "block";
        buttons[1].style.display = "none";
        buttons[2].style.display = "none";
        inputTag.disabled = true;
      } else {
        //cancel button
        buttons[0].style.display = "block";
        buttons[1].style.display = "none";
        buttons[2].style.display = "none";
        inputTag.value = accountInfo[key];
        inputTag.disabled = true;
      }
    });
  }

  const reviews = document.getElementsByClassName("review-item");
  for (let i = 0; i < reviews.length; i++) {
    reviews[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      const buttonLabel = e.target.submitter;
      const buttons = e.target.getElementsByTagName("button");
      const input = e.target.getElementsByTagName("input")[0];
      const value = input.value;
      //console.log(e.target.docId.value);
      if (buttonLabel == "Delete") {
        //const button = document.getElementById("button-delete-review");
        //const label = Util.disableButton(button);
        try {
          await FirebaseController.deleteComment(e.target.docId.value);
        } catch (e) {
          if (Constant.DEV) console.log(e);
          Util.popupInfo("deleteComment error", JSON.stringify(e));
        }
        //Util.enableButton(button, label);
        profile_page();
      } else if (buttonLabel == "Edit") {
        //console.log("Edit")
        buttons[0].style.display = "none";
        buttons[1].style.display = "none";
        buttons[2].style.display = "inline-block";
        buttons[3].style.display = "inline-block";
        input.disabled = false;
      } else if (buttonLabel == "Update") {
        //console.log("Update")
        const update = {};
        try {
          update["content"] = value;
          await FirebaseController.updateComment(e.target.docId.value, update);
        } catch (e) {
          if (Util.DEV) console.log(e);
        }

        buttons[3].style.display = "none";
        buttons[2].style.display = "none";
        buttons[1].style.display = "inline-block";
        buttons[0].style.display = "inline-block";
        input.disabled = true;
      } else {
        //console.log("Cancel")
        buttons[3].style.display = "none";
        buttons[2].style.display = "none";
        buttons[1].style.display = "inline-block";
        buttons[0].style.display = "inline-block";
        input.disabled = true;
      }
    });
  }
}

function actionButtons() {
  return `
        <button onclick="this.form.submitter='Edit'" type="submit" class="btn btn-outline-primary">Edit</button>
        <button onclick="this.form.submitter='Update'" type="submit" class="btn btn-outline-danger" style="display:none;">Update</button>
        <button onclick="this.form.submitter='Cancel'" type="submit" class="btn btn-outline-secondary" formnovalidate="true" style="display:none;">Cancel</button>
    `;
}

export function setProfileIcon(photoURL) {
  Element.menuButtonProfile.innerHTML = `<img src="${photoURL}" class="rounded-circle" height="30px"> `;
}
