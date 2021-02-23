/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const Constant = require("./constant")

exports.admin_addProduct = functions.https.onCall(addProduct)

async function addProduct(data, context){
    try{
        await admin.firestore().collection(Constant.collectionName.PRODUCTS)
            .add(data)
    }catch(e){
        if(Constant.DEV) console.log(e)
        throw new functions.https.HttpsError("internal", "addProduct failed");
    }
}