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
      html += `
      <form class="review-page-item">
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
          <input type="hidden" name="commentId" value="${comment.docId}">
          <button type="submit" id="button-delete-review" class="btn btn-outline-danger"> Delete </button>
        `;
        }
      }
      html += `</form><hr></div>`;
    });
  }
  Element.mainContent.innerHTML = html;

  const reviews = document.getElementsByClassName("review-page-item");
  for (let i = 0; i < reviews.length; i++) {
    reviews[i].addEventListener("submit", async (e) => {
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
}
