/* eslint-disable space-before-blocks */
/* eslint-disable require-jsdoc */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./chase_account_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const Const = require(".constant.js");

function isAdmin(email){
    return Const.adminEmails.includes(email);
}
