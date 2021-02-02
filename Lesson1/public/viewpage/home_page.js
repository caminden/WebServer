import * as Element from "../viewpage/element.js";
import * as Routes from "../controller/routes.js";
import * as Auth from "../controller/auth.js";
import * as Constant from "../model/constant.js"

export function addEventListener() {
  Element.menuHome.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePath.HOME);
    home_page();
  });

  Element.formCreateThread.addEventListener('submit', e=>{
    e.preventDefault()
    const title = Element.formCreateThread.title.value
    const content = Element.formCreateThread.content.value
    const keywords = Element.formCreateThread.keywords.value
  })
}

export function home_page() {
  if (!Auth.currentUser) {
    Element.mainContent.innerHTML = "<h1>Protected Page</h1>";
    return;
  }
  Element.mainContent.innerHTML = `
    <button class="btn btn-outline-danger" data-toggle="modal" data-target="#${Constant.IdmodalCreateNewThread}">+ New Thread</button>
  `;
}
