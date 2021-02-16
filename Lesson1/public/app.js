import * as Auth from './controller/auth.js'
import * as Home from './viewpage/home_page.js'
import * as About from './viewpage/about_page.js'
import * as Routes from './controller/routes.js'
import * as Search from './viewpage/search_page.js'
import * as Profile from './viewpage/profile_page.js'

Auth.addEventListener()
Home.addEventListener()
About.addEventListener()
Search.addEventListeners()
Profile.addEventListener()

window.onload = () => {
    const pathname = window.location.pathname
    const href = window.location.href

    Routes.routing(pathname, href)
}

window.addEventListener('popstate', e => {
    e.preventDefault()
    const pathname = e.target.location.pathname
    const href = e.target.location.href
    Routes.routing(pathname, href)
})
