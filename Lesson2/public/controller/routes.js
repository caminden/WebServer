import * as HomePage from '../viewpage/home_page.js'
import * as ProductPage from '../viewpage/product_page.js'
import * as UserPage from '../viewpage/user_page.js'

export const routePathname = {
    HOME: "/",
    PRODUCTS: '/products',
    USERS: '/users',
}

export const routes = [
    {pathName: routePathname.HOME, page: HomePage.home_page},
    {pathName: routePathname.PRODUCTS, page: ProductPage.product_page},
    {pathName: routePathname.USERS, page: UserPage.user_page},
]

export function routing(path, href){
    const route = routes.find(r => r.pathName == path)
    if(route) route.page()
    else routes[0].page()
}