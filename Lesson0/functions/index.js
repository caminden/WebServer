/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable keyword-spacing */
/* eslint-disable semi */
/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");

exports.doSomething = functions.https.onCall(doSomething);

function doSomething(data, context) {
    const n1 = data.n1
    const n2 = data.n2

    return{
        add: n1 + n2,
        mul: n1 * n2
    }
}
