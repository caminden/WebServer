import * as Element from "./element.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Home from "./home_page.js";
import * as Routes from "../controller/routes.js";

export function addEventListeners() {
  Element.formSearch.addEventListener("submit", async e => {
    e.preventDefault();
    const keywords = e.target.searchKeywords.value.trim();
    if(keywords.length == 0){
        console.log("Reload the home page with original content")
        Home.home_page();
        return;
    }
    history.pushState(null, null, Routes.routePathname.SEARCH + "#" + keywords)
    //console.log(keywords);
    searchPage(keywords);
  })
}

export async function searchPage(keywords){
    let productsList = []
    try{
        productsList = await FirebaseController.searchProducts(keywords)
        console.log("Product list")
        console.log(productsList)
    }catch(e){
        Util.popupInfo("Search error")
    }
    Home.build_homePage(productsList);
}
