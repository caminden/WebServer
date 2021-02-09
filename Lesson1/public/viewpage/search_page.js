import * as Element from './element.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from "../controller/firebase_controller.js"
import * as Constant from "../model/constant.js"
import * as Home from "./home_page.js"
import * as Routes from "../controller/routes.js"

export function addEventListeners(){
    Element.formSearch.addEventListener('submit', e =>{
        e.preventDefault()
        const keywords = e.target.searchKeywords.value.trim()
        if(keywords.length == 0){
            Util.popupInfo("No search keywords", "Enter search keyword(s) to search")
            return
        }
        const keywordsArray = keywords.toLowerCase().match(/\S+/g)
        const joinedSearchKeys = keywordsArray.join('+')
        history.pushState(null, null, Routes.routePath.SEARCH + '#' + joinedSearchKeys)
        search_page(keywordsArray)
    })
}

export async function search_page(keywordsArray){
    if(!Auth.currentUser){
        Element.mainContent.innerHTML = "<h1>Protected Page</h1>"
    }

    let threadList
    try{
        //search firebase firestore and return docs with keywords
        threadList = await FirebaseController.searchThreads(keywordsArray)
    }catch(e){
        if(Constant.DEV) console.log(e)
        Util.popupInfo("Error", JSON.stringify(e))
        return
    }

    Home.buildHomeScreen(threadList)
}