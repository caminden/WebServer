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
