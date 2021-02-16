import * as Auth from '../controller/auth.js'
import * as Element from '../viewpage/element.js'
import * as FirebaseController from "../controller/firebase_controller.js"
import * as Constant from "../model/constant.js"
import * as Util from "../viewpage/util.js"
import { Message } from '../model/message.js'
import * as Routes from '../controller/routes.js'
import { home_page } from './home_page.js'

export function addThreadViewEvents(){
    const viewForms = document.getElementsByClassName('thread-view-form')
    for (let n = 0; n < viewForms.length; n++){
        addThreadFormEvent(viewForms[n])
    }
}

export function addThreadFormEvent(form){
    form.addEventListener('submit', async e=>{
        e.preventDefault()
        const button = e.target.getElementsByTagName('button')[0]
        const label = Util.disableButton(button)
        const threadID = e.target.threadID.value
        history.pushState(null, null, Routes.routePath.THREAD + '#' + threadID)
        thread_page(threadID)
        //await Util.sleep(1000) for testing purpose only
        Util.enableButton(button, label)
    })
}

export async function thread_page(threadID){
    if(!Auth.currentUser){
        Element.mainContent.innerHTML = '<h1>Protected Page</h1>'
        return
    }

    if(!threadID){
        Util.popupInfo("Error", "Invalid Access to thread")
        return
    }

    //1. get thread from firestore
    //2. get all reply messages
    //3. display this thread
    //4. display all replies
    //5. a form to add a new reply

    let thread
    let messages
    try {
        thread = await FirebaseController.getOneThread(threadID)
        if(!thread){
            Util.popupInfo("Error", "Thread does not exist")
            return
        }
        messages = await FirebaseController.getMessageList(threadID)
    }catch(e){
        if(Constant.DEV) console.log(e)
        Util.popupInfo('Error', JSON.stringify(e))
        return
    }

    let html = `
    <h4 class="bg-primary text-white">${thread.title}</h4>
    <div>${thread.email} (At ${new Date(thread.timestamp).toString()})</div>
    <div class="bg-light text-black">${thread.content}</div>
    <button id="button-like">Like</button> <span id="thread-likes">${thread.likes}</span>
    <button id="button-dislike">Dislike</button>
    `;

    //display delete button if the thread owner is also the current one logged in
    if(Auth.currentUser.email == thread.email){
        html += `<button id="delete-thread-button" style="float: right">Delete</button>`
    }
    html += `<hr>`

    html += `<div id="message-reply-body">`
            if(messages && messages.length > 0){
                messages.forEach(m => {
                    html += buildMessageView(m)
                })
            }
    html += `</div>`

    html += `<div>
                <textarea id="textarea-add-new-message" placeholder="Reply to this message"></textarea>
                <br>
                <button id="button-add-new-message" class="btn btn-outline-info">Post message</button>
            </div>`

    Element.mainContent.innerHTML = html

    document.getElementById('button-add-new-message').addEventListener('click', async () => {
        const content = document.getElementById('textarea-add-new-message').value
        const uid = Auth.currentUser.uid
        const email = Auth.currentUser.email
        const timestamp = Date.now()

        const m = new Message({
            uid, email, timestamp, content, threadID
        })

        const button = document.getElementById('button-add-new-message')
        const label = Util.disableButton(button)

        try{
            const docId = await FirebaseController.addMessage(m)
            m.docId = docId
        }catch(e){
            if(Constant.DEV) console.log(e)
            Util.popupInfo("Error", JSON.stringify(e))
        }

        const mTag = document.createElement('div')
        mTag.innerHTML = buildMessageView(m)
        document.getElementById('message-reply-body').appendChild(mTag)

        document.getElementById('textarea-add-new-message').value = ''

        Util.enableButton(button, label)
    })

    //new buttons for like/dislike
    document.getElementById("button-like").addEventListener('click', async () => {
        const likes = document.getElementById('thread-likes')
        let newLikes
        try{
            newLikes = await FirebaseController.updateLikes(threadID, 1)
        }catch(e){
            if(Constant.DEV) console.log(e)
        }
        likes.innerHTML = `${newLikes}`
    })

    document.getElementById("button-dislike").addEventListener('click', async () =>{
        const likes = document.getElementById('thread-likes')
        let newLikes
        try{
            newLikes = await FirebaseController.updateLikes(threadID, 0)
        }catch(e){
            if(Constant.DEV) console.log(e)
        }
        likes.innerHTML = `${newLikes}`
    })

    document.getElementById('delete-thread-button').addEventListener('click', async () => {
        const button = document.getElementById("delete-thread-button")
        const label = Util.disableButton(button)
        try{
            await FirebaseController.deleteThread(threadID)
        }catch(e){
            if(Constant.DEV) console.log(e)
        }
        Util.popupInfo("Delete Successful", "Thread has been deleted")
        Util.enableButton(button, label)
        history.replaceState(null, null, Routes.routePath.HOME)
        home_page();
    })
}

function buildMessageView(message){
    return `
        <div class="border border-primary">
        <div class="bg-info text-white">
            Replied by ${message.email} (At ${new Date(message.timestamp).toString()})
        </div>
            ${message.content}
        </div>
        <hr>
    `
}