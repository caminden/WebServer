import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as Auth from "../controller/auth.js";
import * as Home from "./home_page.js";
import * as Util from './util.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'

export function addEventListeners() {
  Element.menuShoppingcart.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.SHOPPINGCART);
    shoppingcart_page();
  });
}

export function shoppingcart_page() {
  if (!Auth.currentUser) {
    Element.mainContent.innerHTML = "<h1>Protected Page</h1>";
    return;
  }

  const cart = Home.cart;

  let html = "<h1>Shopping Cart</h1>";

  if (!cart || cart.getTotalQty() == 0) {
    html += `<h3>Empty! But more</h3>`;
    Element.mainContent.innerHTML = html;
    return;
  }

  html += ` 
    <table class="table table-striped">
    <thead>
        <tr>
        <th scope="col">Image</th>
        <th scope="col">name</th>
        <th scope="col">Unit price</th>
        <th scope="col">Quantity</th>
        <th scope="col">Sub-total</th>
        <th scope="col" width="50%">Summary</th>
        </tr>
    </thead>
    <tbody>
    `;

    cart.items.forEach(item => {
        html += `
        <tr>
            <td><img src="${item.imageURL}" width="150px"></td>
            <td>${item.name}</td>
            <td>${Util.currency(item.price)}</td>
            <td>${item.qty}</td>
            <td>${Util.currency(item.qty * item.price)}</td>
            <td>${item.summary}</td>
        </tr>
        `
    })

    html += `</tbody></table>`
    html += `
        <div style="font-size: 150%">Total: ${Util.currency(cart.getTotalPrice())}</div>
    `

    html += `
      <button id="button-checkout" class="btn btn-outline-primary">Check out </button>
      <button id="button-continue-shopping" class="btn btn-outline-secondary">Continue Shopping </button>
    `

  Element.mainContent.innerHTML = html;

  const checkOutButton = document.getElementById('button-checkout')
  checkOutButton.addEventListener('click', async () =>{
    const label = Util.disableButton(checkOutButton)

    try{
      await FirebaseController.checkOut(cart)
      Util.popupInfo("Success", "Checkout complete")
      window.localStorage.removeItem(`cart-${Auth.currentUser.uid}`)
      cart.empty()

      Element.shoppingcartCount.innerHTML = "0"
      history.pushState(null, null, Routes.routePathname.HOME)
      await Home.home_page()
    }catch(e){
      if(Constant.DEV) console.log(e)
      Util.popupInfo("Check out Error", JSON.stringify(e))
    }
    Util.enableButton(checkOutButton, label)
  })

  const continueShoppingButton = document.getElementById('button-continue-shopping')
  continueShoppingButton.addEventListener('click', async () =>{
    history.pushState(null, null, Routes.routePathname.HOME)
    const label = Util.disableButton(continueShoppingButton)
    await Home.home_page()
    //Util.enableButton(continueShoppingButton, label)
  })
}
