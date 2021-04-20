/* eslint-disable space-before-blocks */
/* eslint-disable require-jsdoc */
/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-var */

const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const Constant = require("./constant.js");

exports.admin_addProduct = functions.https.onCall(addProduct);
exports.admin_getProductById = functions.https.onCall(getProductById);
exports.admin_updateProduct = functions.https.onCall(updateProduct);
exports.admin_deleteProduct = functions.https.onCall(deleteProduct);
exports.admin_getUserList = functions.https.onCall(getUserList);
exports.admin_updateUser = functions.https.onCall(updateUser);
exports.admin_deleteUser = functions.https.onCall(deleteUser);
exports.admin_checkAdmin = functions.https.onCall(cfCheckAdmin);
exports.admin_deleteComment = functions.https.onCall(deleteComment);
exports.admin_addRules = functions.https.onCall(addRules);
exports.admin_deleteRules = functions.https.onCall(deleteRules);

function isAdmin(email) {
  return Constant.adminEmails.includes(email);
}

async function cfCheckAdmin(email) {
  return Constant.adminEmails.includes(email);
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
  return;
}

async function updateProduct(productInfo, context) {
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
      .doc(productInfo.docId)
      .update(productInfo.data);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "updateProduct failed");
  }
}

async function deleteProduct(docId, context) {
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
      .doc(docId)
      .delete();
  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "deleteProduct failed");
  }
}

async function getUserList(data, context) {
  const userList = [];

  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }

  console.log("here in cf");
  try {
    let userRecord = await admin.auth().listUsers(100);
    userList.push(...userRecord.users); ///... is a spread operator
    let nextPageToken = userRecord.pageToken;
    while (nextPageToken) {
      userRecord = await admin.auth().listUsers(100, nextPageToken);
      userList.push(...userRecord.users);
      nextPageToken = userRecord.pageToken;
    }
  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "getUserList failed");
  }
  return userList;
}

async function updateUser(data, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }

  try {
    const uid = data.uid;
    const update = data.update;
    await admin.auth().updateUser(uid, update);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "updateUser failed");
  }
}

async function deleteUser(uid, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }

  try {
    await admin.auth().deleteUser(uid);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "deleteUser failed");
  }
}

async function getProductById(docId, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }

  try {
    const doc = await admin
      .firestore()
      .collection(Constant.collectionName.PRODUCTS)
      .doc(docId)
      .get();
    if (doc.exists) {
      const { name, summary, price, imageName, imageURL, tags } = doc.data();
      const p = { name, price, summary, imageName, imageURL, tags };
      p.docId = doc.id;
      return p;
    } else return null;
  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "getProductById failed");
  }
}

async function deleteComment(commentId, context) {
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
      .collection(Constant.collectionName.COMMENTS)
      .doc(commentId)
      .delete();
  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "deleteComment failed");
  }
}

async function deleteRules(ruleId, context) {
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
      .collection(Constant.collectionName.RULES)
      .doc(ruleId)
      .delete();
  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "deleteRule failed");
  }
}

async function addRules(data, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }
  let docId
  try {
    docId = await admin.firestore().collection(Constant.collectionName.RULES).add(data);
  } catch (e) {
    if (Constant.DEV) console.log(e);
  }
  return docId;
}
