import * as Element from './element.js'
import * as Auth from '../controller/auth.js'
import * as Routes from '../controller/routes.js'

export function addEventListeners(){
    Element.menuButtonProfile.addEventListener('click', e=>{
        history.pushState(null, null, Routes.routePathname.PROFILE)
        e.preventDefault()
        profile_page()
    })
}

export function profile_page(){

    if(!Auth.currentUser){
        Element.mainContent.innerHTML = "<h1>Protected Page</h1>"
        return
    }
    Element.mainContent.innerHTML = "<h1>Profile Page</h1>"
}