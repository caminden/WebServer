/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const Constant = require("./constant");

exports.admin_addProduct = functions.https.onCall(addProduct);
exports.admin_getProductList = functions.https.onCall(getProductList);
exports.admin_getProductById = functions.https.onCall(getProductById);
exports.admin_updateProduct = functions.https.onCall(updateProduct);
exports.admin_deleteProduct = functions.https.onCall(deleteProduct);

function isAdmin(email) {
  return Constant.adminEmails.includes(email);
}

async function getProductList(data, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }

  try{
    let parray = []
    const snapShot = await admin.firestore().collection(Constant.collectionName.PRODUCTS)
                    .orderBy("name").get()
    snapShot.forEach(doc => {
        const {name, price, summary, imageName, imageURL} = doc.data()
        const p = {name, price, summary, imageName, imageURL}
        p.docId = doc.id
        parray.push(p)
    })
    return parray
  }catch(e){
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "getProductList failed");
  }
}

async function addProduct(data, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }

  try {
    await admin
      .firestore()
      .collection(Constant.collectionName.PRODUCTS)
      .add(data);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "addProduct failed");
  }
}

async function getProductById(docId, context){
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }

  try{
    const doc = await admin.firestore().collection(Constant.collectionName.PRODUCTS)
                .doc(docId).get()
    if(doc.exists){
      const {name, summary, price, imageName, imageURL} = doc.data()
      const p = {name, price, summary, imageName, imageURL}
      p.docId = doc.id
      return p;
    }
    else return null;
  }catch(e){
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "getProductById failed");
  }
}

async function updateProduct(productInfo, context){
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }
  try{
    await admin.firestore().collection(Constant.collectionName.PRODUCTS)
        .doc(productInfo.docId).update(productInfo.data)
  }catch(e){
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "updateProduct failed");
  }
}

async function deleteProduct(docId, context){
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }
  try{
    await admin.firestore().collection(Constant.collectionName.PRODUCTS)
            .doc(docId).delete()
  }catch(e){
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "deleteProduct failed");
  }
}
