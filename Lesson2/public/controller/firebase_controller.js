import * as Constant from '../model/constant.js'

export async function signIn(email, password){
    await firebase.auth().signInWithEmailAndPassword(email, password)    
}

export async function signOut(){
    await firebase.auth().signOut()
}

export async function uploadImage(imageFile, imageName){
    if(!imageName){
        imageName = Date.now() + imageFile.name
    }
    const ref = firebase.storage().ref()
                .child(Constant.storageFolderName.PRODUCT_IMAGES + imageName)
    
    const taskSnapShot = await ref.put(imageFile)
    const imageURL = await taskSnapShot.ref.getDownloadURL()
    return {imageName, imageURL}
}



const cf_addProduct = firebase.functions().httpsCallable('admin_addProduct')
export async function addProduct(product){
    await cf_addProduct(product.serialize())
}