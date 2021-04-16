import * as Routes from './controller/routes.js'

//use cloud function emulator
if(window.location.host.includes("localhost") ||
    window.location.host.includes("127.0.0.1")){
        firebase.functions().useFunctionsEmulator("http://localhost:5001")
    }

window.onload = () => {
    const path = window.location.pathname
    const href = window.location.href
    Routes.routing(path, href)
}

window.addEventListener('popstate', e=>{
    e.preventDefault();
    const pathname = e.target.location.pathname
    const href = e.target.location.href
    Routes.routing(pathname, href)
})

import * as Auth from "./controller/auth.js"
import * as Home from './viewpage/home_page.js'
import * as Profile from './viewpage/profile_page.js'
import * as Purchases from './viewpage/purchases_page.js'
import * as ShoppingCart from './viewpage/shoppingcart_page.js'
import * as Users from './viewpage/user_page.js'
import * as Add from './controller/add_product.js'
import * as Rules from './viewpage/rule_page.js'
import * as Edit from './controller/edit_product.js'

Auth.addEventListeners()
Home.addEventListeners()
Profile.addEventListeners()
Purchases.addEventListeners()
ShoppingCart.addEventListeners()
Add.addEventListeners()
Edit.addEventListeners()
Users.addEventListeners()
Rules.addEventListeners()

