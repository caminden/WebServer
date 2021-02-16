import * as Element from "../viewpage/element.js";
import * as Routes from "../controller/routes.js";
import * as Auth from "../controller/auth.js";
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Home from './home_page.js'
import * as ThreadPage from './thread_page.js'

export function addEventListener() {
Element.menuProfile.addEventListener("click", e =>{
        e.preventDefault();
      history.pushState(null, null, Routes.routePath.PROFILE)
      profile_page()
  })
}

export async function profile_page(){
    if (!Auth.currentUser) {
        Element.mainContent.innerHTML = "<h1>Protected Page</h1>";
        return;
      }
      const currentUser = Auth.currentUser.email
      let myThreads
      try{
        myThreads = await FirebaseController.countThreads(currentUser)
      }catch(e){
          if(Constant.DEV) console.log(e)
      }

    let html = `<h1>Profile Page</h1>
                <hr>
    `
    html += `User: ${currentUser} <br>
            <hr>
            Thread Count: ${myThreads.length} <br>
    `
    html += `
    <table class="table table-striped">
    <thead>
      <tr>
        <th scope="col">Action</th>
        <th scope="col">Title</th>
        <th scope="col">Keywords</th>
        <th scope="col">Likes</th>
        <th scope="col">Content</th>
        <th scope="col">Posted At</th>
      </tr>
    </thead>
    <tbody id ="thread-body-tag">
    `;
  
    myThreads.forEach((thread) => {
      html += '<tr>' + buildThreadView(thread) + '</tr>';
    });
  
    html += `
      </body></table>
    `;
  
    if(myThreads.length == 0){
      html += `<h4>No Threads Found</h4>`
    }

    Element.mainContent.innerHTML = html;

    ThreadPage.addThreadViewEvents()
}

function buildThreadView(thread) {
    return `
        <td>
            <form method="post" class="thread-view-form">
                <input type="hidden" name="threadID" value="${thread.docId}">
                <button type="submit" class="btn btn-outline-primary">View</button>
            </form>
        </td>
        <td>${thread.title}</td>
        <td>${thread.keywordsArray.join(" ")}</td>
        <td>${thread.likes}</td>
        <td>${thread.content}</td>
        <td>${new Date(thread.timestamp).toString()}</td>
    `
  }