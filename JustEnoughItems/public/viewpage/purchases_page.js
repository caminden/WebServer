import * as Element from "./element.js";
import * as Auth from "../controller/auth.js";
import * as Routes from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import { Comment } from "../model/comment.js";

export function addEventListeners() {
  Element.menuButtonPurchases.addEventListener("click", (e) => {
    history.pushState(null, null, Routes.routePathname.PURCHASES);
    e.preventDefault();
    purchases_page();
  });
}

let carts;

export async function purchases_page() {
  if (!Auth.currentUser) {
    Element.mainContent.innerHTML = "<h1>Protected Page</h1>";
    return;
  }

  try {
    carts = await FirebaseController.getPurchaseHistory(Auth.currentUser.uid);
    if (!carts || carts.length == 0) {
      Element.mainContent.innerHTML = "No Purchase History found";
      return;
    }
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("Load PurchaseHistory error", JSON.stringify(e));
    return;
  }

  let html = `<h1>Purchase History</h1>`;

  html += `
    <table class="table table-striped">
    <thead>
    <tbody>
    `;
  for (let index = 0; index < carts.length; index++) {
    html += `
            <tr><td>
                <form class="purchase-history" method="post">
                    <input type="hidden" name="index" value="${index}">
                    <button class="btn btn-outline-secondary" type="submit">
                        ${new Date(carts[index].timestamp).toString()}
                </form>
            </td></tr>
        `;
  }
  html += `</tbody> </thead>`;

  Element.mainContent.innerHTML = html;

  const historyForms = document.getElementsByClassName("purchase-history");
  for (let i = 0; i < historyForms.length; i++) {
    historyForms[i].addEventListener("submit", (e) => {
      e.preventDefault();
      const index = e.target.index.value;
      Element.modalTransactionTitle.innerHTML = `Purchases at: ${new Date(
        carts[index].timestamp
      ).toString()}`;
      Element.modalTransactionBody.innerHTML = buildTransactionDetail(
        carts[index]
      );
      $("#modal-transaction").modal("show");

      const reviewForms = Element.modalTransactionBody.getElementsByClassName(
        "review-forms"
      );

      for (let i = 0; i < reviewForms.length; i++) {
        reviewForms[i].addEventListener("submit", (e) => {
          e.preventDefault();
          //console.log(e.target.productId.value);
          $("#modal-transaction").modal("hide");
          Element.modalReviewTitle.innerHTML = `<div style="display: inline-block;"><img src="${e.target.imageURL.value}" width="150px">`;
          Element.modalReviewTitle.innerHTML += `<div class="center-button">${e.target.name.value}</div></div>`;
          Element.modalReviewBody.innerHTML = `<form class="add-new-comment" method="post">
                <input type="hidden" name="productId" value="${e.target.productId.value}">
                <input type="hidden" name="productName" value="${e.target.name.value}">
                <textarea name="content" placeholder="Leave a comment"></textarea>
                <br>
                <button type="submit" class="btn btn-outline-info">Post Comment</button>
            </form>`;

          $("#modal-review-form").modal("show");

          const addButtons = Element.modalReviewBody.getElementsByClassName("add-new-comment")[0];
          addButtons.addEventListener("submit", async (e) => {
            e.preventDefault();
            const content = e.target.content.value
            const productId = e.target.productId.value
            const name = e.target.productName.value
            const uid = Auth.currentUser.uid
            const email = Auth.currentUser.email
            const timestamp = Date.now()
            //console.log(content);
            //console.log(e.target.productId.value);


            const c = new Comment({
                uid, email, timestamp, content, productId, name
            })

            try{
                const docId = await FirebaseController.addComment(c)
                c.docId = docId
                Util.popupInfo("Review Posted", "Thank you for your feedback!", "modal-review-form");
            }catch(e){
                if(Constant.DEV) console.log(e)
                Util.popupInfo("Error", JSON.stringify(e), "modal-review-form")
            }

          });
        });
      }
    });
}

    
}

function buildTransactionDetail(cart) {
  let html = `
    <table class="table table-striped">
        <thead>
        <tr>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Qty</th>
            <th scope="col">Subtotal</th>
            <th scope="col" width="50%">Summary</th>
        </tr>
        </thead>
        <tbody>
    `;
  cart.items.forEach((item) => {
    html += `
            <tr>
                <td><img src="${item.imageURL}" width="150px"></td>
                <td>${item.name}</td>
                <td>${Util.currency(item.price)}</td>
                <td>${item.qty}</td>
                <td>${Util.currency(item.price * item.qty)}</td>
                <td>${item.summary}</td>
                <td>
                <form class="review-forms" method="post">
                     <input type="hidden" name="name" value="${item.name}">
                     <input type="hidden" name="productId" value="${
                       item.docId
                     }">
                    <input type="hidden" name="imageURL" value="${
                      item.imageURL
                    }">
                    <button type="submit" class="btn btn-outline-dark">
                        Leave Review
                    </button>
                    </form>
                </td>
            </tr>
        `;
  });

  html += `</tbody></table>`;
  html += `<div style="font-size: 150%">Total: ${Util.currency(
    cart.getTotalPrice()
  )}</div>`;

  return html;
}
