import * as FirebaseController from '../controller/firebase_controller.js'
import { Product } from '../model/product.js';
import * as Element from '../viewpage/element.js'
import * as Constant from '../model/constant.js'

let imageFiletoUpload

export function addEventListeners(){
    Element.formAddProduct.addEventListener('submit', e => {
        e.preventDefault();
        addNewProduct(e)
    })

    Element.formAddImgButton.addEventListener('change', e => {
       imageFiletoUpload = e.target.files[0]
       const reader = new FileReader()
       reader.onload = () => Element.imgTagAddProduct.src = reader.result
       reader.readAsDataURL(imageFiletoUpload)
    })
}

async function addNewProduct(e){
    const name = e.target.name.value
    const price = e.target.price.value
    const summary = e.target.summary.value

    const product = new Product({name, price, summary});

    try{
        const {imageName, imageURL} = await FirebaseController.uploadImage(imageFiletoUpload)
        product.imageName = imageName
        product.imageURL = imageURL
        await FirebaseController.addProduct(product)
    }catch(e){
        if(Constant.DEV) console.log(e)
    }
}