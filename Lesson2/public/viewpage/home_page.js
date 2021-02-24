import * as Element from './element.js'
import * as Routes from '../controller/routes.js'

export function addEventListeners(){
    Element.menuHome.addEventListener('click', e => {
        history.pushState(null, null, Routes.routePathname.HOME)
        home_page()
    })
}

export function home_page(){
    Element.mainContent.innerHTML = `
        <h1>Welcome to Admin's page</h1>
        <h3>
            <ul>
                <li>Add/Edit/Delete products </li>
                <li>Manage Users </li>
            </ul>
        </h3>
    `
}