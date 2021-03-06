import * as Element from "./element.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Add from "../controller/add_product.js";
import * as Util from "./util.js";
import * as Routes from "../controller/routes.js";
import * as Constant from "../model/constant.js";
import * as Edit from '../controller/edit_product.js'

export function addEventListeners() {
  Element.menuProducts.addEventListener("click", async (e) => {
    e.preventDefault();
    history.pushState(null, null, Routes.routePathname.PRODUCTS);
    const button = Element.menuProducts;
    const label = Util.disableButton(button);
    await product_page();
    Util.enableButton(button, label);
  });
}

export async function product_page() {
  let html = `
    <div>
    <button id="button-add-product" class="btn btn-outline-danger">+ Add Product</button>
    </div>
   `;

  let products;
  try {
    products = await FirebaseController.getProductList();
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("getProductList error", JSON.stringify(e));
    return;
  }
  products.forEach((p) => {
    html += buildProductCard(p);
  });

  Element.mainContent.innerHTML = html;

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

function buildProductCard(product) {
  return `
   <div id="card-${product.docId}" class="card" style="width: 18rem; display: inline-block">
   <img src=${product.imageURL} class="card-img-top">
      <div class="card-body">
         <h5 class="card-title">${product.name}</h5>
         <p class="card-text">$${product.price}<br>${product.summary}</p>
      </div>
      <form class="form-edit-product float-left" method="post">
        <input type="hidden" name="docId" value="${product.docId}">
        <button class="btn btn-outline-primary" type="submit">Edit</button>
      </form>
      <form class="form-delete-product float-right" method="post">
        <input type="hidden" name="docId" value="${product.docId}">
        <input type="hidden" name="imageName" value="${product.imageName}">
        <button class="btn btn-outline-danger" type="submit">Delete</button>
      </form>
   </div>
   `;
}
