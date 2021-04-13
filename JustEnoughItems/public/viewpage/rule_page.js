import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as Auth from "../controller/auth.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import { Rules } from "../model/rules.js";
import * as Util from "./util.js";

export function addEventListeners() {
  Element.menuRules.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.RULES);
    rule_page();
  });

  Element.formCreateRule.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = Element.formCreateRule.getElementsByTagName("button")[0];
    const label = Util.disableButton(button);

    const title = Element.formCreateRule.title.value;
    const content = Element.formCreateRule.content.value;

    const rule = new Rules({
      title,
      content,
    });

    try {
      await FirebaseController.addRules(rule);
      Element.formCreateRule.reset()
      rule_page();
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
        Constant.IdModelCreateNewRule
      );
      return;
    }
    Util.enableButton(button, label);
  });
}

export async function rule_page() {
  if (!Auth.currentUser) {
    Element.mainContent.innerHTML = "<h1>Protected Page</h1>";
    return;
  }

  let html = `<h1>Rule Page</h1>
  <p style="text-align: center">All rules for this webpage will be displayed here</p>
  `;

  try {
    if (Auth.isAdmin) {
      html += `<div class="center-button"><button class="btn btn-outline-info" data-toggle="modal" data-target="#${Constant.IdModelCreateNewRule}">Add Rule</button></div>`;
    }
  } catch (e) {
    if (Constant.DEV) console.log(e);
  }

  html += "<hr><br>";

  let rules;
  try {
    rules = await FirebaseController.getRules();
    //console.log(rules)
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("Failed to get rules", JSON.stringify(e));
    return;
  }

  rules.forEach((rule) => {
    if (Auth.isAdmin) {
      html += `<div class="rule-delete-button">
              <button id="delete-button-${rule.docId}" value="${rule.docId}" class="btn btn-outline-danger" style="margin: 8px 0;padding: 8px 2px;">Delete</button>
              </div>`;
    }
    html += `<div class="card-header">${rule.title}</div>
            <div class="card-body">${rule.content}</div>
            </br>
            `;
  });

  Element.mainContent.innerHTML = html;

  const buttons = document.getElementsByClassName("rule-delete-button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", async e => {
      console.log(e.target.value);
      e.preventDefault();
      const button = document.getElementById(`delete-button-${e.target.value}`);
      const label = Util.disableButton(button);
      try{
        await FirebaseController.deleteRules(e.target.value)
      }catch(e){
        if (Constant.DEV) console.log(e);
        Util.popupInfo("deleteRule error", JSON.stringify(e));
      }
      rule_page()
    });
  }
}
