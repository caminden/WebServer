import * as Element from './element.js'
import * as Auth from '../controller/auth.js'
import * as Routes from '../controller/routes.js'

export function addEventListeners(){
    Element.menuButtonPurchases.addEventListener('click', e=>{
        history.pushState(null, null, Routes.routePathname.PURCHASES)
        e.preventDefault()
        purchases_page()
    })
}

export function purchases_page(){
    if(!Auth.currentUser){
        Element.mainContent.innerHTML = "<h1>Protected Page</h1>"
        return
    }
    Element.mainContent.innerHTML = "<h1>Purchase History</h1>"
}