import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as Auth from "../controller/auth.js";
import * as Home from "./home_page.js";

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
            <td>$${item.price}</td>
            <td>${item.qty}</td>
            <td>$${item.qty * item.price}</td>
            <td>${item.summar}</td>
        </tr>
        `
    })

    html += `</tbody></table>`
    html += `
        <div style="font-size: 150%">Total: $${cart.getTotalPrice()}</div>
    `

  Element.mainContent.innerHTML = html;
}
