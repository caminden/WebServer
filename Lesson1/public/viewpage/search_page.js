import * as Element from './element.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'

export function addEventListeners(){
    Element.formSearch.addEventListener('submit', e =>{
        e.preventDefault()
        const keywords = e.target.searchKeywords.value.trim()
        if(keywords.length == 0){
            Util.popupInfo("No search keywords", "Enter search keyword(s) to search")
            return
        }
        const keywordsArray = keywords.toLowerCase().match(/\S+/g)
        search_page(keywordsArray)
    })
}

export function search_page(keywordsArray){
    if(!Auth.currentUser){
        Element.mainContent.innerHTML = "<h1>Protected Page</h1>"
    }

    try{
        //search firebase firestore and return docs with keywords
    }catch(e){

    }
}