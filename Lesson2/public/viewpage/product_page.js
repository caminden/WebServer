import * as Element from './element.js'
import * as FirebaseController from '../controller/firebase_controller.js'

export function product_page(){
   let html = `
    <div>
    <button id="button-add-product" class="btn btn-outline-danger" data-toggle="modal" data-target="#modal-add-product">+ Add Product</button>
    </div>
   `

   Element.mainContent.innerHTML = html
  
}