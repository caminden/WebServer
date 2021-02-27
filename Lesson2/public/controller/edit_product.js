import * as FirebaseController from './firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from '../viewpage/util.js'
import * as Element from '../viewpage/element.js'
import { Product } from '../model/product.js'

let imageFile2Upload

export function addEventListeners(){
    Element.formEditImageFileButton.addEventListener('change', e=> {
        imageFile2Upload = e.target.files[0]
        if(!imageFile2Upload){return}
        const reader = new FileReader()
        reader.onload = () => Element.formEditImageTag.src = reader.result
        reader.readAsDataURL(imageFile2Upload)
    })

    Element.formEditProduct.addEventListener('submit', e=>{
        e.preventDefault()

        const p = new Product({
            name: e.target.name.value,
            price: e.target.price.value,
            summary: e.target.summary.value,
            imageName: e.target.imageName.value,
        })
        p.docId = e.target.docId.value
    })
}

export async function editProduct(docId){
    let product 
    try{
        product = await FirebaseController.getProductById(docId)
        if(!product){
            Util.popupInfo("getProductById error", `No product found at id ${docId}`)
            return
        }
    }catch(e){
        if(Constant.DEV) console.log(e)
        Util.popupInfo("getProductIdError", JSON.stringify(e))
        return
    }

    Element.formEditProduct.docId.value = product.docId
    Element.formEditProduct.name.value = product.name
    Element.formEditProduct.price.value = product.price
    Element.formEditProduct.summary.value = product.summary
    Element.formEditProduct.imageName.value = product.imageName
    Element.formEditImageTag.src = product.imageURL

    $('#modal-edit-product').modal('show')


}
