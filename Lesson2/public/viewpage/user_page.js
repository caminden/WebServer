import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";

export function addEventListeners() {
  Element.menuUsers.addEventListener("click", async () => {
    const label = Util.disableButton(Element.menuUsers)
    history.pushState(null, null, Routes.routePathname.USERS);
    await user_page();
    Util.enableButton(Element.menuUsers, label)
  });
}

export async function user_page() {
  let html = `
        <h1>Manage Users</h1>
    `;
  let userList;
  try {
    userList = await FirebaseController.getUserList();
    userList.forEach((user) => {
      html += buildUserCard(user);
    });
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("Error getUserList", JSON.stringify(e));
  }

  Element.mainContent.innerHTML = html;

  const toggleForms = document.getElementsByClassName("form-toggle-users");
  for (let i = 0; i < toggleForms.length; i++) {
    toggleForms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = e.target.getElementsByTagName('button')[0]
      const label = Util.disableButton(button)
      const uid = e.target.uid.value;
      const update = {
        disabled: e.target.disabled.value === "true" ? false : true,
      };
      try {
        await FirebaseController.updateUser(uid, update);
        e.target.disabled.value = `${update.disabled}`
        document.getElementById(`status-${uid}`).innerHTML = `${update.disabled ? 'Disabled' : 'Enabled'}`
        Util.popupInfo("Status toggled: Disabled is ", `${update.disabled}`);
      } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.popupInfo("Status toggle error", JSON.stringify(e));
      }
      Util.enableButton(button, label)
    });
  }

  const deleteForms = document.getElementsByClassName("form-delete-users");
  for(let i = 0; i < deleteForms.length; i++){
    deleteForms[i].addEventListener('submit', async e => {
        e.preventDefault();
        const r = confirm("Are you sure you want to delete?")
       if(!r){return}
       const button = e.target.getElementsByTagName("button")[0]
        Util.disableButton(button)
       const uid = e.target.uid.value
       try{
        await FirebaseController.deleteUser(uid)
        document.getElementById(`user-card-${uid}`).remove()
        Util.popupInfo("Delete Success", `${uid} was deleted`)
       }catch(e){
        if (Constant.DEV) console.log(e);
        Util.popupInfo("Delete error", JSON.stringify(e));
       }
       //dont need to reset button cause the card is gone
    })  
  }
}

function buildUserCard(user) {
  return `
    <div id="user-card-${user.uid}" class="card" style="width: 18rem; display: inline-block">
        <img src="${
          user.photoURL != null ? user.photoURL : "images/profile.png"
        }" class="card-img-top">
        <div class="card-body">
        <h5 class="card-title">${user.email}</h5>
        <p class="card-text">
            Display Name: ${user.displayName}</br>
            Phone Number: ${user.phoneNumber}</br>
            Account Status: <span id="status-${user.uid}">${user.disabled ? "Disabled" : "Enabled"} </span>
        </p>
        <form class="form-toggle-users" method="post"> 
            <input type="hidden" name="uid" value="${user.uid}">
            <input type="hidden" name="disabled" value="${user.disabled}">
            <button class="btn btn-outline-primary" type="submit">Toggle Active</button>
        </form>
        <form class="form-delete-users" method="post">
            <input type="hidden" name="uid" value="${user.uid}">
            <button class="btn btn-outline-danger" type="submit">Delete</button>
        </form>
        </div>
    </div>
    `;
}
