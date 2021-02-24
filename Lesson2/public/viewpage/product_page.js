import * as Element from "./element.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Add from "../controller/add_product.js";
import * as Util from "./util.js";
import * as Routes from "../controller/routes.js";
import * as Constant from "../model/constant.js";

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
}

function buildProductCard(product) {
  return `
   <div class="card" style="width: 18rem; display: inline-block">
   <img src=${product.imageURL} class="card-img-top">
      <div class="card-body">
         <h5 class="card-title">${product.name}</h5>
         <p class="card-text">$${product.price}<br>${product.summary}</p>
      </div>
   </div>
   `;
}
