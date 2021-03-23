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