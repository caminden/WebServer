import * as ShoppingCart from "../viewpage/shoppingcart_page.js"
import * as Home from "../viewpage/home_page.js"
import * as Profile from "../viewpage/profile_page.js"
import * as Purchases from "../viewpage/purchases_page.js"

export const routePathname = {
    HOME: '/',
    PURCHASES: '/purchases',
    PROFILE: '/profile', 
    SHOPPINGCART: '/shoppingcart'
}

export const routes = [
    {pathname: routePathname.HOME, page: Home.home_page},
    {pathname: routePathname.PURCHASES, page: Purchases.purchases_page},
    {pathname: routePathname.PROFILE, page: Profile.profile_page},
    {pathname: routePathname.SHOPPINGCART, page: ShoppingCart.shoppingcart_page}
]

export function routing(path){
    const route = routes.find(r => r.pathname == path)
    if(route) route.page()
    else route[0].page()
}