import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";

export function addEventListeners() {
  Element.menuButtonHome.addEventListener("click", (e) => {
    history.pushState(null, null, Routes.routePathname.HOME);
    e.preventDefault();
    home_page();
  });
}

export async function home_page() {
  let html = `<h1>Enjoy shopping!</h1>`;
  let products;
  try {
    products = await FirebaseController.getProductList();
    products.forEach((product) => {
      html += buildProductCard(product);
    });
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("getProuct error", JSON.stringify(e));
    return;
  }

  Element.mainContent.innerHTML = html;
}

function buildProductCard(product) {
  return `
  <div class="card" style="width: 18rem; display: inline-block;" >
    <img src="${product.imageURL}" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title">${product.name}</h5>
      <p class="card-text">
      $ ${product.price} <br>
      ${product.summary}
      </p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>
  `;
}
