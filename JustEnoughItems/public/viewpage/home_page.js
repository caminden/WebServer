import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";
import { ShoppingCart } from "../model/shoppingcart.js";
import * as Add from "../controller/add_product.js";
import { review_page } from "./review_page.js";
import * as Edit from '../controller/edit_product.js'

export function addEventListeners() {
  Element.menuButtonHome.addEventListener("click", async (e) => {
    history.pushState(null, null, Routes.routePathname.HOME);
    e.preventDefault();
    const label = Util.disableButton(Element.menuButtonHome);
    await home_page();
    Util.enableButton(Element.menuButtonHome, label);
  });
}

export let cart;
let products;
let page = 0;
export async function home_page() {
  let html = `<h1>Enjoy shopping!</h1>`;

  //if(Auth.currentUser){
  // cart = new ShoppingCart(Auth.currentUser.uid)
  //}

 
    html += `
    <div>
    <button id="button-add-product" class="btn btn-outline-danger" style="display: ${Auth.isAdmin ? "block" : "none"}">+ Add Product</button>
    </div>
   `;
  

  try {
    products = await FirebaseController.getProductList();
    if (cart && cart.items) {
      cart.items.forEach((item) => {
        const product = products.find((p) => {
          return item.docId == p.docId;
        });
        product.qty = item.qty;
      });
    }
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("getProuct error", JSON.stringify(e));
    return;
  }

  //console.log(page);

  for (let i = page * 3; i < page * 3 + 3; i++) {
    if (products[i] != null) {
      html += buildProductCard(products[i], i);
    }
  }

  html += `
  <br>
  <button id="page-button-left" style="float: left">Prev</button>
  ${page}
  <button id="page-button-right" style="float: right">Next</button>`;

  Element.mainContent.innerHTML = html;

  document
    .getElementById("page-button-right")
    .addEventListener("click", async (e) => {
      if (page * 3 + 3 < products.length) {
        ++page;
      }
      console.log("next" + page);
      await home_page();
    });

  document
    .getElementById("page-button-left")
    .addEventListener("click", async (e) => {
      if (page > 0) {
        --page;
      } else {
        page = 0;
      }
      console.log("prev" + page);

      await home_page();
    });

  //event listeners for plus and minus
  if (!Auth.isAdmin) {
    const plusForms = document.getElementsByClassName("form-increase-qty");
    for (let i = 0; i < plusForms.length; i++) {
      plusForms[i].addEventListener("submit", (e) => {
        e.preventDefault();
        const p = products[e.target.index.value];
        cart.addItem(p);
        document.getElementById(`qty-${p.docId}`).innerHTML = p.qty;
        Element.shoppingcartCount.innerHTML = cart.getTotalQty();
      });
    }

    const minusForms = document.getElementsByClassName("form-decrease-qty");
    for (let i = 0; i < minusForms.length; i++) {
      minusForms[i].addEventListener("submit", (e) => {
        e.preventDefault();
        const p = products[e.target.index.value];
        cart.removeItem(p);
        document.getElementById(`qty-${p.docId}`).innerHTML =
          p.qty == null || p.qty == 0 ? "Add" : p.qty;
        Element.shoppingcartCount.innerHTML = cart.getTotalQty();
      });
    }
  }

  if (Auth.isAdmin) {
    document
      .getElementById("button-add-product")
      .addEventListener("click", (e) => {
        Element.formAddProduct.reset();
        Add.resetImageSelection();
        $("#modal-add-product").modal("show");
      });

  const editButtons = document.getElementsByClassName("form-edit-product")
  for(let i = 0; i < editButtons.length; i++){
    editButtons[i].addEventListener('submit', e => {
      e.preventDefault();
      
      const button = e.target.getElementsByTagName('button')[0]
      const label = Util.disableButton(button)
      Edit.editProduct(e.target.docId.value)
      Util.enableButton(button, label)
    })
  }

  const tagButtons = document.getElementsByClassName("form-tag-product")
  for(let i = 0; i < tagButtons.length; i++){
    tagButtons[i].addEventListener("submit", e => {
      e.preventDefault();
      console.log(e.target.docId.value);
      Edit.addTag(e.target.docId.value);
    })
  }

  const deleteButtons = document.getElementsByClassName("form-delete-product")
  for(let i = 0; i < deleteButtons.length; i++){
    deleteButtons[i].addEventListener('submit', async e => {
      e.preventDefault();
      const button = e.target.getElementsByTagName('button')[0]
      const label = Util.disableButton(button)
      Edit.deleteProduct(e.target.docId.value, e.target.imageName.value)
      Util.enableButton(button, label)
    })
  }
}

  const reviewButtons = document.getElementsByClassName("review-buttons");
  for (let i = 0; i < reviewButtons.length; i++) {
    reviewButtons[i].addEventListener("click", (e) => {
      e.preventDefault();
      //console.log("review");
      //console.log(e.target.value);
      history.pushState(
        null,
        null,
        Routes.routePathname.REVIEWS + "#" + e.target.value
      );
      review_page(e.target.value);
    });
  }
}

function buildProductCard(product, index) {
  return `
  <div class="card" style="width: 18rem; display: inline-block;" >
    <img src="${product.imageURL}" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title">${product.name}</h5>
      <p class="card-text">
      ${Util.currency(product.price)} <br>
      ${product.summary}
      </p>
      <div class="container pt-3 bg-light ${
        Auth.currentUser && !Auth.isAdmin ? "d-block" : "d-none"
      }">
        <form method="post" class="d-inline form-decrease-qty">
            <input type="hidden" name="index" value="${index}">
            <button class="btn btn-outline-danger" type="submit">&minus;</button>
        </form>
        <div id="qty-${
          product.docId
        }" class="container rounded text-center text-white bg-primary d-inline-block w-50"> 
            ${product.qty == null || product.qty == 0 ? "Add" : product.qty} 
        </div>
        <form method="post" class="d-inline form-increase-qty">
            <input type="hidden" name="index" value="${index}">
            <button class="btn btn-outline-danger" type="submit">&plus;</button>
        </form>
      </div>
      <div class="container ${
        Auth.currentUser && Auth.isAdmin ? "d-block" : "d-none"
      }">
      <form class="form-edit-product float-left" style="padding-left: 8px;" method="post">
        <input type="hidden" name="docId" value="${product.docId}">
        <button class="btn btn-outline-primary" type="submit">Edit</button>
      </form>
      <form class="form-tag-product float-left" style="padding-left: 8px;" method="post">
        <input type="hidden" name="docId" value="${product.docId}">
        <button class="btn btn-outline-primary" type="submit">Tag</button>
      </form>
      <form class="form-delete-product float-left" style="padding-left: 8px;" method="post">
        <input type="hidden" name="docId" value="${product.docId}">
        <input type="hidden" name="imageName" value="${product.imageName}">
        <button class="btn btn-outline-danger" type="submit">Delete</button>
      </form>
      </div>
      <div class="review-buttons">
        <button value="${
          product.docId
        }" class="btn btn-outline-primary" style="margin: 8px 0;padding: 8px 2px;border-width: 2px 2px 2px 2px;width: 100%;" type="click">Reviews</button>
      </div>
    </div>
  </div>
  `;
}

export function getShoppingCartFromLocalStorage() {
  let cartString = window.localStorage.getItem(`cart-${Auth.currentUser.uid}`);
  //cartString = '{"key": 50}'
  cart = ShoppingCart.parse(cartString);
  if (!cart || !cart.isValid() || Auth.currentUser.uid != cart.uid) {
    window.localStorage.removeItem(`cart-${Auth.currentUser.uid}`);
    cart = new ShoppingCart(Auth.currentUser.uid);
  }

  Element.shoppingcartCount.innerHTML = cart.getTotalQty();
}
