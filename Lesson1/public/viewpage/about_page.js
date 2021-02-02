import * as Element from '../viewpage/element.js'
import * as Routes from '../controller/routes.js'

export function addEventListener(){
    Element.menuAbout.addEventListener("click", () => {
        history.pushState(null, null, Routes.routePath.ABOUT)
        about_page()
    })
}

export function about_page(){
    Element.mainContent.innerHTML = '<h1>About Page</h1>'
}