import * as Home from "../viewpage/home_page.js"
import * as About from "../viewpage/about_page.js"
import * as ThreadPage from '../viewpage/thread_page.js'
import * as Search from '../viewpage/search_page.js'
import * as Profile from '../viewpage/profile_page.js'

export const routePath = {
    HOME: '/',
    ABOUT: '/about',
    THREAD: '/thread',
    SEARCH: '/search',
    PROFILE: '/profile',
}

export const routes = [
    {path: routePath.HOME, page: Home.home_page},
    {path: routePath.ABOUT, page: About.about_page},
    {path: routePath.THREAD, page: ThreadPage.thread_page},
    {path: routePath.SEARCH, page: Search.search_page},
    {path: routePath.PROFILE, page: Profile.profile_page}
]

let threadID
export function routing(pathname, href){
    const threadIDIndex = href.indexOf(routePath.THREAD)
    const searchIndex = href.indexOf(routePath.SEARCH)
    let uri
    if(threadIDIndex > 0) {
        //thread view
        const len = routePath.THREAD.length
        uri = href.substr(threadIDIndex + len + 1) 
    }
    else if(searchIndex > 0){
        const len = routePath.SEARCH.length
        uri = href.substr(searchIndex + len + 1).split('+')
    }
    const route = routes.find(r => r.path == pathname)
    if(route) route.page(uri)
    else routes[0].page()
}