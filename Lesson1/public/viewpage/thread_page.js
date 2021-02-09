import * as Auth from '../controller/auth.js'
import * as Element from '../viewpage/element.js'
import * as FirebaseController from "../controller/firebase_controller.js"
import * as Constant from "../model/constant.js"
import * as Util from "../viewpage/util.js"
import { Message } from '../model/message.js'
import * as Routes from '../controller/routes.js'

export function addThreadViewEvents(){
    const viewForms = document.getElementsByClassName('thread-view-form')
    for (let n = 0; n < viewForms.length; n++){
        addThreadFormEvent(viewForms[n])
    }
}

export function addThreadFormEvent(form){
    form.addEventListener('submit', e=>{
        e.preventDefault()
        const threadID = e.target.threadID.value
        history.pushState(null, null, Routes.routePath.THREAD + '#' + threadID)
        thread_page(threadID)
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
    <hr>
    `;

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