import * as Constant from "../model/constant.js";
import { Message } from "../model/message.js";
import { Thread } from "../model/thread.js";

export async function signIn(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut() {
  await firebase.auth().signOut();
}

export async function addThread(thread) {
  const ref = await firebase
    .firestore()
    .collection(Constant.collectionName.THREAD)
    .add(thread.serialize());

  return ref.id; //unique doc id generated by firestore
}

export async function getThreadList() {
  let threadList = [];
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.THREAD)
    .orderBy("timestamp", "desc")
    .get();
  snapShot.forEach((doc) => {
    const t = new Thread(doc.data());
    t.docId = doc.id;
    threadList.push(t);
  });
  return threadList;
}

export async function getOneThread(threadID) {
  const ref = await firebase
    .firestore()
    .collection(Constant.collectionName.THREAD)
    .doc(threadID)
    .get();
  if (!ref.exists) {
    return null;
  }
  const t = new Thread(ref.data());
  t.docID = threadID;
  return t;
}

export async function addMessage(message) {
  const ref = await firebase
    .firestore()
    .collection(Constant.collectionName.MESSAGES)
    .add(message.serialize());
  return ref.id;
}

export async function getMessageList(threadID) {
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.MESSAGES)
    .where("threadID", "==", threadID)
    .orderBy("timestamp")
    .get();

  const messages = [];
  snapShot.forEach((doc) => {
    const m = new Message(doc.data());
    m.docId = doc.id;
    messages.push(m);
  });
  return messages;
}

export async function searchThreads(keywordsArray) {
  const threadList = [];
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.THREAD)
    .where("keywordsArray", "array-contains-any", keywordsArray)
    .orderBy("timestamp", "desc")
    .get();

  snapShot.forEach((doc) => {
    const t = new Thread(doc.data());
    t.docId = doc.id;
    threadList.push(t);
  });
  return threadList;
}

export async function signUp(email, password) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
}

export async function updateLikes(threadID, value) {
  //get existing document for old information
  const ref = await firebase
    .firestore()
    .collection(Constant.collectionName.THREAD)
    .doc(threadID)
    .get();

  //call firestore to set new data and merge all other information
  if (value == 1) {
    await firebase
      .firestore()
      .collection(Constant.collectionName.THREAD)
      .doc(threadID)
      .set(
        {
          likes: ref.data().likes + 1,
        },
        { merge: true }
      );
    return ref.data().likes + 1;
  } //value = 1 for likes, value=0 for dislikes
  else {
    await firebase
      .firestore()
      .collection(Constant.collectionName.THREAD)
      .doc(threadID)
      .set(
        {
          likes: ref.data().likes - 1,
        },
        { merge: true }
      );
    return ref.data().likes - 1;
  }
}

export async function deleteThread(threadID) {
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.MESSAGES)
    .where("threadID", "==", threadID)
    .get()
    .then(function (snapShot) {
      var batch = firebase.firestore().batch();

      snapShot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      batch.commit();
      return;
    });

  await firebase
    .firestore()
    .collection(Constant.collectionName.THREAD)
    .doc(threadID)
    .delete();
}

export async function countThreads(email) {
  let threadList = []
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.THREAD)
    .where("email", "==", email)
    .get();

    snapShot.forEach((doc) => {
      const t = new Thread(doc.data());
      t.docId = doc.id;
      threadList.push(t);
    });
    return threadList;
}
