import * as Element from "../viewpage/element.js";
import * as Routes from "../controller/routes.js";
import * as Auth from "../controller/auth.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import { Rules } from "../model/rules.js";
import * as Util from './util.js'

export function addEventListeners() {
  Element.menuAbout.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePath.ABOUT);
    about_page();
  });

  Element.formCreateRule.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = Element.formCreateThread.getElementsByTagName("button")[0];
    const label = Util.disableButton(button);

    const title = Element.formCreateRule.title.value;
    const content = Element.formCreateRule.content.value;

    const rule = new Rules({
      title,
      content,
    });

    try {
      const docId = await FirebaseController.addRules(rule)
      rule.docId = docId;
      about_page()
      Util.popupInfo(
        "Success",
        "A new rule has been created",
        Constant.IdModelCreateNewRule
      );
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.popupInfo(
        "Failed to add",
        JSON.stringify(e),
        Constant.IdmodalCreateNewThread
      );
      return;
    }
    Util.enableButton(button, label)
  });
}

export async function about_page() {
  if (!Auth.currentUser) {
    Element.mainContent.innerHTML = "<h1>Protected Page</h1>";
    return;
  }

  let html = `<h1>About Page</h1>
  <p style="text-align: center">All rules for this webpage will be displayed here</p>
  `;

  try {
    const isAdmin = await FirebaseController.isAdmin(Auth.currentUser.email);
    if (isAdmin.data) {
      html += `<span><button class="btn btn-outline-info" data-toggle="modal" data-target="#${Constant.IdModelCreateNewRule}">Add Rule</button></span>`;
    }
  } catch (e) {
    if (Constant.DEV) console.log(e);
  }

  html += "<hr><br>"

  let rules
  try {
    rules = await FirebaseController.getRules();
    //console.log(rules)
  } catch (e) {
    if(Constant.DEV) console.log(e);
    Util.popupInfo("Failed to get rules", JSON.stringify(e))
    return
  }

  rules.forEach((rule) => {
    html += `<div class="card-header">${rule.title}</div>
            <div class="card-body">${rule.content}</div>
    `
  })

  Element.mainContent.innerHTML = html;
}

