import * as Element from "./element.js";
import * as Auth from "../controller/auth.js";
import * as Routes from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";

export async function review_page(productId){
    let html = `<h1>Review Page</h1>
    `
    
    let comments = []

    try{
        comments = await FirebaseController.getCommentList(productId)
    }catch(e){
        if(Constant.DEV) console.log(e)
        Util.popupInfo("Error", JSON.stringify(e))
    }
    
    if(comments.length == 0){
        html += "No Reviews for this item yet"
    }
    else{
        comments.forEach(comment => {
            html += `<h3>${comment.email} : ${comment.content}</h3> <br>`
        })
    }
    Element.mainContent.innerHTML = html;
}