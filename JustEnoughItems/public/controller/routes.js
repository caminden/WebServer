import * as ShoppingCart from "../viewpage/shoppingcart_page.js";
import * as Home from "../viewpage/home_page.js";
import * as Profile from "../viewpage/profile_page.js";
import * as Purchases from "../viewpage/purchases_page.js";
import * as Reviews from "../viewpage/review_page.js";
import * as Rules from "../viewpage/rule_page.js";

export const routePathname = {
  HOME: "/",
  PURCHASES: "/purchases",
  PROFILE: "/profile",
  SHOPPINGCART: "/shoppingcart",
  REVIEWS: `/reviews`,
  RULES: "/rules",
};

export const routes = [
  { pathname: routePathname.HOME, page: Home.home_page },
  { pathname: routePathname.PURCHASES, page: Purchases.purchases_page },
  { pathname: routePathname.PROFILE, page: Profile.profile_page },
  { pathname: routePathname.SHOPPINGCART, page: ShoppingCart.shoppingcart_page,},
  { pathname: routePathname.REVIEWS, page: Reviews.review_page },
  { pathname: routePathname.RULES, page: Rules.rule_page },
];

let productIdIndex;
export function routing(path, href) {
  if (href != null) {
    productIdIndex = href.indexOf(routePathname.REVIEWS);
  }

  let uri;
  //console.log(productIdIndex)
  if (productIdIndex > 0) {
    const len = routePathname.REVIEWS.length;
    uri = href.substr(productIdIndex + len + 1);
    //console.log(uri)
  }
  const route = routes.find((r) => r.pathname == path);
  if (route) route.page(uri);
  else route[0].page();
}
