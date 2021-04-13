import * as Element from "./element.js";
import * as Auth from "../controller/auth.js";
import * as Routes from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";

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
      html += 
      `<div class="review-page-item"> 
        <div class="card-header"> ${comment.email} says : </div> 
        <div style="font-size: 24px"> ${comment.content}</div>`;
        html += `<div style="font-size: 14px; text-align: right;">${new Date(
        comment.timestamp).toString()}</div>
      `;
      if (Auth.currentUser) {
        if (Auth.isAdmin || Auth.currentUser.email == comment.email) {
          html += `<button value="${comment.docId}" id="button-delete-review" class="btn btn-outline-danger">Delete</button>`;
        }
      }
      html += `<hr></div>`;
    });
  }
  Element.mainContent.innerHTML = html;

  const reviews = document.getElementsByClassName("review-page-item");
  for (let i = 0; i < reviews.length; i++) {
    reviews[i].addEventListener("click", async (e) => {
      console.log(e.target.value);
      const button = document.getElementById("button-delete-review");
      const label = Util.disableButton(button);
      try {
        if (Auth.isAdmin) {
          await FirebaseController.adminDeleteComment(e.target.value);
        } else {
          await FirebaseController.deleteComment(e.target.value);
        }
      } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.popupInfo("deleteComment error", JSON.stringify(e));
      }
      Util.enableButton(button, label);
      review_page(productId);
    });
  }
}
