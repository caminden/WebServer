import * as Element from "../viewpage/element.js";
import * as Routes from "../controller/routes.js";
import * as Auth from "../controller/auth.js";

export function addEventListener() {
  Element.menuAbout.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePath.ABOUT);
    about_page();
  });
}

export function about_page() {
  if (!Auth.currentUser) {
    Element.
    return;
  }
  let html = `<h1>About Page</h1>`

  html += `<h3> What we are about </h3>
    <p><ul> 
      <li><h5>
      We here at Awesome Discussion Forum strive to take our site seriously and make improvements
      wherever we can. We value all of our users and will do our best to make the site good for them and everything
      they do.
      </h5></li>
      <li><h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur neque quis lorem dapibus bibendum. Suspendisse ac dui et ante facilisis ornare. Sed ut odio ut ipsum accumsan porttitor et eu dui. 
      Curabitur sed massa eget enim vehicula viverra. Maecenas dictum elementum nulla, sed auctor mauris auctor vel. Vivamus nec ultrices mauris. Pellentesque sem velit, auctor ac dapibus et, tincidunt quis lectus.
      </h5></li>
      <li><h5>
      Duis molestie sit amet nibh eget blandit. Sed euismod odio in erat consequat vehicula. Donec ut diam sollicitudin, semper ipsum eget, elementum nulla. Nunc blandit sem justo, et pharetra risus aliquam vitae. 
      Aenean non diam lacus. Cras tempor at mauris tempor dapibus. Sed ornare euismod massa. 
      Duis malesuada quam id leo sodales, eget tempus enim auctor. Nulla egestas dapibus erat, sed mattis elit. Etiam ligula orci, tincidunt quis sagittis non, volutpat eget neque. Donec volutpat risus fermentum euismod volutpat.
      </h5></li>
    </ul></p>
  `

  Element.mainContent.innerHTML = html;

}
