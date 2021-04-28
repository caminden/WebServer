import * as ShoppingCart from "../viewpage/shoppingcart_page.js";
import * as Home from "../viewpage/home_page.js";
import * as Profile from "../viewpage/profile_page.js";
import * as Purchases from "../viewpage/purchases_page.js";
import * as Reviews from "../viewpage/review_page.js";
import * as Rules from "../viewpage/rule_page.js";
import * as Search from '../viewpage/search_page.js'

export const routePathname = {
  HOME: "/",
  PURCHASES: "/purchases",
  PROFILE: "/profile",
  SHOPPINGCART: "/shoppingcart",
  REVIEWS: `/reviews`,
  RULES: "/rules",
  SEARCH: "/search",
};

export const routes = [
  { pathname: routePathname.HOME, page: Home.home_page },
  { pathname: routePathname.PURCHASES, page: Purchases.purchases_page },
  { pathname: routePathname.PROFILE, page: Profile.profile_page},
  {
    pathname: routePathname.SHOPPINGCART,
    page: ShoppingCart.shoppingcart_page,
  },
  { pathname: routePathname.REVIEWS, page: Reviews.review_page },
  { pathname: routePathname.RULES, page: Rules.rule_page },
  { pathname: routePathname.SEARCH, page: Search.searchPage }
];

let productIdIndex;
export function routing(path, href) {
  console.log(path);
  const productIdIndex = href.indexOf(routePathname.REVIEWS);
  const searchIndex = href.indexOf(routePathname.SEARCH)
  const profileIndex = href.indexOf(routePathname.PROFILE);
  let uri;
  //console.log(productIdIndex)
  if (productIdIndex > 0) {
    const len = routePathname.REVIEWS.length;
    uri = href.substr(productIdIndex + len + 1);
    //console.log(uri)
  }
  console.log(searchIndex)
  if(searchIndex > 0){
    const len = routePathname.SEARCH.length;
    uri = href.substr(searchIndex + len + 1)
    console.log(uri)
  }
  const route = routes.find((r) => r.pathname == path);
  if (route) route.page(uri);
  else route[0].page();
}
