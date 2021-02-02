import * as Element from '../viewpage/element.js'
import * as Routes from '../controller/routes.js'

export function addEventListener(){
    Element.menuHome.addEventListener("click", () => {
        history.pushState(null, null, Routes.routePath.HOME)
        home_page()
    })
}

export function home_page(){
    Element.mainContent.innerHTML = '<h1>Home Page</h1>'
}