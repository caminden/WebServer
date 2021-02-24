import * as Routes from "./controller/routes.js"

if (
  window.location.host.includes("localhost") ||
  window.location.host.includes("127.0.0.1")
) {
  firebase.functions().useFunctionsEmulator("http://localhost:5001");
}

window.onload = () => {
    const pathname = window.location.pathname
    const href = window.location.href
    Routes.routing(pathname, href)
}

window.addEventListener('popstate', e => {
  e.preventDefault();
  const pathname = e.target.location.pathname
  const href = e.target.location.href
  Routes.routing(pathname, href)
})

//add event handlers from all modules
import * as Auth from './controller/auth.js'
import * as Add from './controller/add_product.js'
import * as Product from './viewpage/product_page.js'
import * as Home from './viewpage/home_page.js'

Auth.addEventListeners();
Add.addEventListeners();
Product.addEventListeners();
Home.addEventListeners();
