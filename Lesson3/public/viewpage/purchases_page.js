import * as Element from './element.js'
import * as Auth from '../controller/auth.js'

export function addEventListeners(){
    Element.menuButtonPurchases.addEventListener('click', e=>{
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