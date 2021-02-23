import * as Element from './element.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Add from '../controller/add_product.js'

export function product_page(){
   let html = `
    <div>
    <button id="button-add-product" class="btn btn-outline-danger">+ Add Product</button>
    </div>
   `

   Element.mainContent.innerHTML = html

   document.getElementById('button-add-product').addEventListener('click', e => {
      Element.formAddProduct.reset()
      Add.resetImageSelection()
      $('#modal-add-product').modal('show')
   })
  
}