import {Product} from '../model/product.js'
import * as Constant from '../model/constant.js'

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