import {Product} from '../model/product.js'
import * as Constant from '../model/constant.js'
import { ShoppingCart } from '../model/shoppingcart.js'

export async function signIn(email, password){
    await firebase.auth().signInWithEmailAndPassword(email, password)
}

export async function signOut(){
    await firebase.auth().signOut()
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