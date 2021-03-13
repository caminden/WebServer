import * as Element from './element.js'

export function addEventListeners(){
    Element.menuButtonHome.addEventListener('click', e=>{
        e.preventDefault()
        home_page()
    })
}

export function home_page(){

    Element.mainContent.innerHTML = "<h1>Home Page</h1>"
}