import * as Routes from './controller/routes.js'

//use cloud function emulator
if(window.location.host.includes("localhost") ||
    window.location.host.includes("127.0.0.1")){
        firebase.functions().useFunctionsEmulator("http://localhost:5001")
    }

window.onload = () => {
    const path = window.location.pathname
    Routes.routing(path)
}

window.addEventListener('popstate', e=>{
    e.preventDefault();
    const pathname = e.target.location.pathname
    Routes.routing(pathname)
})

import * as Auth from "./controller/auth.js"
import * as Home from './viewpage/home_page.js'
import * as Profile from './viewpage/profile_page.js'
import * as Purchases from './viewpage/purchases_page.js'

Auth.addEventListeners()
Home.addEventListeners()
Profile.addEventListeners()
Purchases.addEventListeners()