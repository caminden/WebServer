import {Product} from '../model/product.js'
import * as Constant from '../model/constant.js'
import { ShoppingCart } from '../model/shoppingcart.js'
import { AccountInfo } from '../model/account_info.js'

export async function signIn(email, password){
    await firebase.auth().signInWithEmailAndPassword(email, password)
}

export async function signOut(){
    await firebase.auth().signOut()
}

export async function createUser(email, password){
    await firebase.auth().createUserWithEmailAndPassword(email, password)
}

export async function getProductList(){
    let products = []
    const snapShot = await firebase.firestore().collection(Constant.collectionName.PRODUCTS)
        .orderBy('name')
        .get()
    snapShot.forEach(doc => {
        const p = new Product(doc.data())
        p.docId = doc.id
        products.push(p)
    })
    return products
}

export async function checkOut(cart){
    const data = cart.serialize(Date.now())
    await firebase.firestore().collection(Constant.collectionName.PURCHASE_HISTORY)
        .add(data)
}

export async function getPurchaseHistory(uid){
    const snapShot = await firebase.firestore().collection(Constant.collectionName.PURCHASE_HISTORY)
        .where('uid', '==', uid).orderBy('timestamp', 'desc').get()

    const carts = []
    snapShot.forEach(doc => {
        const sc = ShoppingCart.deserialize(doc.data())
        carts.push(sc)
    })
    return carts
}

export async function getAccountInfo(uid){
    const doc = await firebase.firestore().collection(Constant.collectionName.ACCOUNT_INFO)
                .doc(uid).get()
    if(doc.exists){
        return new AccountInfo(doc.data())
    }
    else{
        const defaultInfo = AccountInfo.instance()
        await firebase.firestore().collection(Constant.collectionName.ACCOUNT_INFO)
                    .doc(uid).set(defaultInfo.serialize())
        return defaultInfo
    }
}

export async function updateAccountInfo(uid, updateInfo){
    await firebase.firestore().collection(Constant.collectionName.ACCOUNT_INFO)
                .doc(uid).update(updateInfo)
}

export async function uploadProfilePhoto(photoFile, imageName){
    const ref = firebase.storage().ref()
                .child(Constant.storageFolderName.PROFILE_PHOTOS + imageName)
    const task = await ref.put(photoFile)
    const photoURL = await task.ref.getDownloadURL()
    return photoURL
}   

export async function uploadImage(imageFile, imageName) {
  if (!imageName) {
    imageName = Date.now() + imageFile.name;
  }
  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PRODUCT_IMAGES + imageName);

  const taskSnapShot = await ref.put(imageFile);
  const imageURL = await taskSnapShot.ref.getDownloadURL();
  return { imageName, imageURL };
}

const cf_addProduct = firebase.functions().httpsCallable("admin_addProduct");
export async function addProduct(product) {
  await cf_addProduct(product.serialize());
}


const cf_isAdmin = firebase.functions().httpsCallable("admin_checkAdmin");
export async function isAdmin(email){
    const result = await cf_isAdmin(email);
    return result.data;
}

const cf_getUserList = firebase.functions().httpsCallable("admin_getUserList");
export async function getUserList() {
  const result = await cf_getUserList();
  return result.data;
}

const cf_updateUser = firebase.functions().httpsCallable("admin_updateUser");
export async function updateUser(uid, update) {
  await cf_updateUser({ uid, update });
}

