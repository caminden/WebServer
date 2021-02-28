import * as Element from './element.js'
import * as Routes from '../controller/routes.js'

export function addEventListeners(){
    Element.menuUsers.addEventListener('click', ()=>{
        history.pushState(null, null, Routes.routePathname.USERS)
        user_page()
    })
}

export function user_page(){
    Element.mainContent.innerHTML = "Manage Users"
}