import * as Auth from '../controller/auth.js'
import * as Element from '../viewpage/element.js'
import * as FirebaseController from "../controller/firebase_controller.js"
import * as Constant from "../model/constant.js"
import * as Util from "../viewpage/util.js"

export function addThreadViewEvents(){
    const viewForms = document.getElementsByClassName('thread-view-form')
    for (let n = 0; n < viewForms.length; n++){
        viewForms[n].addEventListener('submit', e=>{
            e.preventDefault()
            const threadID = e.target.threadID.value
            thread_page(threadID)
        })
    }
}

export async function thread_page(threadID){
    if(!Auth.currentUser){
        Element.mainContent.innerHTML = '<h1>Protected Page</h1>'
        return
    }

    //1. get thread from firestore
    //2. get allr eply messages
    //3. display this thread
    //4. display all replies
    //5. a form to add a new reply

    let thread

    try {
        thread = await FirebaseController.getOneThread(threadID)
    }catch(e){
        if(Constant.DEV) console.log(e)
        Util.popupInfo('Error', JSON.stringify(e))
        return
    }

    let html = `
    <h4 class="bg-primary text-white">${thread.title}</h4>
    <div>${thread.email} (At ${new Date(thread.timestamp).toString()})</div>
    <div class="bg-secondary text-white">${thread.content}</div>
    `;

    Element.mainContent.innerHTML = html
}