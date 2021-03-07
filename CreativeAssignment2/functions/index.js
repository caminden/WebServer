/* eslint-disable space-before-blocks */
/* eslint-disable require-jsdoc */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */

const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./chase_account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const Const = require("./constant");

exports.admin_isAdmin = functions.https.onCall(isAdmin);
exports.admin_deleteMessage = functions.https.onCall(deleteMessage);
exports.admin_addRules = functions.https.onCall(addRules);

function cfCheckAdmin(email) {
  return Const.adminEmails.includes(email);
}

async function isAdmin(email, context) {
  return Const.adminEmails.includes(email);
}

async function deleteMessage(theadID, context) {
  if (!cfCheckAdmin(context.auth.token.email)) {
    if (Const.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }

  await admin
    .firestore()
    .collection(Const.collectionName.MESSAGES)
    .where("threadID", "==", theadID)
    .get()
    .then(function (snapShot) {
      var batch = admin.firestore().batch();
      snapShot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      batch.commit();
      return;
    });

  await admin
    .firestore()
    .collection(Const.collectionName.THREAD)
    .doc(theadID)
    .delete();
}

async function addRules(data, context) {
  if (!cfCheckAdmin(context.auth.token.email)) {
    if (Const.DEV) console.log("not admit: ", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You do not have these priviledges"
    );
  }

  try {
    await admin.firestore().collection(Const.collectionName.RULES).add(data);
  } catch (e) {
    if (Const.DEV) console.log(e);
  }
}
