import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import * as Auth from '../controller/auth.js'
import { ShoppingCart } from "../model/shoppingcart.js";

export function addEventListeners() {
  Element.menuButtonHome.addEventListener("click", async (e) => {
    history.pushState(null, null, Routes.routePathname.HOME);
    e.preventDefault();
    const label = Util.disableButton(Element.menuButtonHome)
    await home_page();
    Util.enableButton(Element.menuButtonHome, label)
  });
}

export let cart
let products;

export async function home_page() {
  let html = `<h1>Enjoy shopping!</h1>`;

  //if(Auth.currentUser){
  // cart = new ShoppingCart(Auth.currentUser.uid)
  //}

  try {
    products = await FirebaseController.getProductList();
    if(cart && cart.items){
      cart.items.forEach(item => {
        const product = products.find(p => {
          return item.docId == p.docId
        })
        product.qty = item.qty
      })
    }
    
    let index = 0
    products.forEach((product) => {
      html += buildProductCard(product, index);
      ++index;
    });
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("getProuct error", JSON.stringify(e));
    return;
  }

  Element.mainContent.innerHTML = html;

  //event listeners for plus and minus
  const plusForms = document.getElementsByClassName("form-increase-qty")
  for(let i = 0; i < plusForms.length; i++){
    plusForms[i].addEventListener('submit', e =>{
      e.preventDefault()
      const p = products[e.target.index.value]
      cart.addItem(p)
      document.getElementById(`qty-${p.docId}`).innerHTML = p.qty
      Element.shoppingcartCount.innerHTML = cart.getTotalQty()
    })
  }

  const minusForms = document.getElementsByClassName("form-decrease-qty")
  for(let i = 0; i < minusForms.length; i++){
    minusForms[i].addEventListener("submit", e => {
      e.preventDefault()
      const p = products[e.target.index.value]
      cart.removeItem(p)
      document.getElementById(`qty-${p.docId}`).innerHTML = 
          (p.qty == null || p.qty == 0 ? 'Add' : p.qty)
      Element.shoppingcartCount.innerHTML = cart.getTotalQty()
    })
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
      <div class="container pt-3 bg-light ${Auth.currentUser ? 'd-block' : 'd-none'}">
        <form method="post" class="d-inline form-decrease-qty">
            <input type="hidden" name="index" value="${index}">
            <button class="btn btn-outline-danger" type="submit">&minus;</button>
        </form>
        <div id="qty-${product.docId}" class="container rounded text-center text-white bg-primary d-inline-block w-50"> 
            ${product.qty == null || product.qty == 0 ? 'Add' : product.qty} 
        </div>
        <form method="post" class="d-inline form-increase-qty">
            <input type="hidden" name="index" value="${index}">
            <button class="btn btn-outline-danger" type="submit">&plus;</button>
        </form>
      </div>
    </div>
  </div>
  `;
}

export function getShoppingCartFromLocalStorage(){
  let cartString = window.localStorage.getItem(`cart-${Auth.currentUser.uid}`)
  //cartString = '{"key": 50}'
    cart = ShoppingCart.parse(cartString)
    if(!cart || !cart.isValid() || Auth.currentUser.uid != cart.uid){
      window.localStorage.removeItem(`cart-${Auth.currentUser.uid}`)
      cart = new ShoppingCart(Auth.currentUser.uid)
    }

  Element.shoppingcartCount.innerHTML = cart.getTotalQty()
}
