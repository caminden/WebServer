import * as Element from "./element.js";
import * as Auth from "../controller/auth.js";
import * as Routes from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Profile from './profile_page.js'

export async function review_page(productId) {
  let html = `<h1>Review Page</h1>
    `;

  let comments = [];

  try {
    comments = await FirebaseController.getCommentList(productId);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("Error", JSON.stringify(e));
  }

  if (comments.length == 0) {
    html += "No Reviews for this item yet";
  } else {
    comments.forEach((comment) => {
      html += `
      <table class="table table-sm">
            <tr>
              <td width="100%"><h4>${comment.email} posted:</h4>${new Date(comment.timestamp).toString()}</td>
            </tr>
            <tr>
                <td width="60%" height=20px> 
                <h5>${comment.content}</h5>
                </td>
            </tr>
      </table>
      `;
      if (Auth.currentUser) { //if null, cannot check currentUser.email
        if (Auth.isAdmin || Auth.currentUser.email == comment.email) {
          html += `
          <form class="delete-button">
          <input type="hidden" name="commentId" value="${comment.docId}">
          <button type="submit" id="button-delete-review" class="btn btn-outline-danger"> Delete </button>
          </form>
        `;
        }
        html += `
       <form class="profile-button">
          <input type="hidden" name="accountId" value="${comment.uid}">
           <input type="hidden" name="accountEmail" value="${comment.email}">
          <button type="submit" id="button-profile-view" class="btn btn-outline-primary"> View Profile </button>
        </form>
        `;
      }
      html += `<hr></div>`;
    });
  }
  Element.mainContent.innerHTML = html;

  const deleteButtons = document.getElementsByClassName("delete-button");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log(e.target.commentId.value);
      const button = document.getElementById("button-delete-review");
      const label = Util.disableButton(button);
      try {
        if (Auth.isAdmin) {
          await FirebaseController.adminDeleteComment(e.target.commentId.value);
        } else {
          await FirebaseController.deleteComment(e.target.commentId.value);
        }
      } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.popupInfo("deleteComment error", JSON.stringify(e));
      }
      Util.enableButton(button, label);
      review_page(productId);
    });
  }

  const profileButtons = document.getElementsByClassName("profile-button");
  for(let i = 0; i < profileButtons.length; i++){
    profileButtons[i].addEventListener("submit", async e => {
      e.preventDefault();
      console.log(e.target.accountId.value)
      let accountInfo
      const accountId = e.target.accountId.value
      const accountEmail = e.target.accountEmail.value
      const button = document.getElementById("button-profile-view");
      const label = Util.disableButton(button);
      /*try{
        accountInfo = await FirebaseController.getAccountInfo(accountId);
        console.log("Account retrieved")
      }catch(e){
         if (Constant.DEV) console.log(e);
         Util.popupInfo("Cannot retrieve account info", JSON.stringify(e));
      }*/

      await Profile.profilePage(accountId, accountEmail);
    })
  }
}
