import { Product } from "../model/product.js";
import * as Constant from "../model/constant.js";
import { ShoppingCart } from "../model/shoppingcart.js";
import { AccountInfo } from "../model/account_info.js";
import { Comment } from "../model/comment.js";
import { Rules } from "../model/rules.js";
import { FriendList } from "../model/friendlist.js";

export async function signIn(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut() {
  await firebase.auth().signOut();
}

export async function createUser(email, password) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
}

export async function getProductList() {
  let products = [];
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.PRODUCTS)
    .orderBy("name")
    .get();
  snapShot.forEach((doc) => {
    const p = new Product(doc.data());
    p.docId = doc.id;
    products.push(p);
  });
  return products;
}

export async function checkOut(cart) {
  const data = cart.serialize(Date.now());
  console.log("Serialized");
  await firebase
    .firestore()
    .collection(Constant.collectionName.PURCHASE_HISTORY)
    .add(data);
}

export async function getPurchaseHistory(uid) {
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.PURCHASE_HISTORY)
    .where("uid", "==", uid)
    .orderBy("timestamp", "desc")
    .get();

  const carts = [];
  snapShot.forEach((doc) => {
    const sc = ShoppingCart.deserialize(doc.data());
    carts.push(sc);
  });
  return carts;
}

export async function getAccountInfo(uid) {
  const doc = await firebase
    .firestore()
    .collection(Constant.collectionName.ACCOUNT_INFO)
    .doc(uid)
    .get();
  if (doc.exists) {
    return new AccountInfo(doc.data());
  } else {
    const defaultInfo = AccountInfo.instance();
    await firebase
      .firestore()
      .collection(Constant.collectionName.ACCOUNT_INFO)
      .doc(uid)
      .set(defaultInfo.serialize());
    return defaultInfo;
  }
}

export async function updateAccountInfo(uid, updateInfo) {
  await firebase
    .firestore()
    .collection(Constant.collectionName.ACCOUNT_INFO)
    .doc(uid)
    .update(updateInfo);
}

export async function uploadProfilePhoto(photoFile, imageName) {
  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PROFILE_PHOTOS + imageName);
  const task = await ref.put(photoFile);
  const photoURL = await task.ref.getDownloadURL();
  return photoURL;
}

export async function uploadImage(imageFile, imageName) {
  if (!imageName) {
    imageName = Date.now() + imageFile.name;
  }
  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PRODUCT_IMAGES + imageName);

  const taskSnapShot = await ref.put(imageFile);
  const imageURL = await taskSnapShot.ref.getDownloadURL();
  return { imageName, imageURL };
}

export async function addComment(comment) {
  const ref = await firebase
    .firestore()
    .collection(Constant.collectionName.COMMENT)
    .add(comment.serialize());
  return ref.id;
}

export async function getCommentList(productId) {
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.COMMENT)
    .where("productId", "==", productId)
    .orderBy("timestamp")
    .get();

  const comments = [];
  if (snapShot != null && snapShot.length != 0) {
    snapShot.forEach((doc) => {
      const c = new Comment(doc.data());
      c.docId = doc.id;
      comments.push(c);
    });
  }
  return comments;
}

export async function getUserComments(email) {
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.COMMENT)
    .where("email", "==", email)
    .orderBy("timestamp")
    .get();
  const comments = [];
  snapShot.forEach((doc) => {
    const c = new Comment(doc.data());
    c.docId = doc.id;
    comments.push(c);
  });
  return comments;
}

export async function deleteComment(commentId) {
  await firebase
    .firestore()
    .collection(Constant.collectionName.COMMENT)
    .doc(commentId)
    .delete();
}

export async function getRules() {
  let ruleList = [];
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.RULES)
    .get();
  snapShot.forEach((doc) => {
    const r = new Rules(doc.data());
    r.docId = doc.id;
    ruleList.push(r);
  });
  return ruleList;
}

export async function updateComment(commentId, content) {
  await firebase
    .firestore()
    .collection(Constant.collectionName.COMMENT)
    .doc(commentId)
    .update(content);

  return;
}

export async function checkReview(uid, docId) {
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.COMMENT)
    .where("uid", "==", uid)
    .get();
  let result = true;
  snapShot.forEach((doc) => {
    if (doc.data().productId == docId) {
      result = false;
    }
  });
  return result;
}

export async function searchProducts(keywords) {
  const snapshot = await firebase
    .firestore()
    .collection(Constant.collectionName.PRODUCTS)
    .get();
  const productList = [];
  snapshot.forEach((doc) => {
    if (doc.data().tags.length != 0) {
      let tags = doc.data().tags;
      tags.forEach((tag) => {
        if (keywords.toLowerCase() == tag.toLowerCase()) {
          const p = new Product(doc.data());
          p.docId = doc.id;
          productList.push(p);
        }
      });
    }
  });
  return productList;
}

export async function getFriendsList(email){
   let friendList = [];
   const snapShot = await firebase
     .firestore()
     .collection(Constant.collectionName.FRIENDS)
     .where("owner", "==", email)
     .get();
   snapShot.forEach((doc) => {
     const f = new FriendList(doc.data());
     f.docId = doc.id;
     friendList.push(f);
   });
   return friendList;
}

export async function addFriend(friend){
    const ref = await firebase
      .firestore()
      .collection(Constant.collectionName.FRIENDS)
      .add(friend.serialize());
    return ref.id;
}

const cf_getProductById = firebase
  .functions()
  .httpsCallable("admin_getProductById");
export async function getProductById(docId) {
  const result = await cf_getProductById(docId);
  if (result.data) {
    //console.log(result.data)
    const product = new Product(result.data);
    product.docId = result.data.docId;
    return product;
  } else return null;
}

const cf_deleteProduct = firebase
  .functions()
  .httpsCallable("admin_deleteProduct");
export async function deleteProduct(docId, imageName) {
  await cf_deleteProduct(docId);
  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PRODUCT_IMAGES + imageName);
  await ref.delete();
}

const cf_addRules = firebase.functions().httpsCallable("admin_addRules");
export async function addRules(rules) {
  await cf_addRules(rules.serialize());
}

const cf_deleteRules = firebase.functions().httpsCallable("admin_deleteRules");
export async function deleteRules(rulesId) {
  await cf_deleteRules(rulesId);
}

const cf_updateProduct = firebase
  .functions()
  .httpsCallable("admin_updateProduct");
export async function updateProduct(product) {
  const docId = product.docId;
  const data = product.serializeForUpdate();
  //console.log(data)
  await cf_updateProduct({ docId, data });
}

const cf_deleteComment = firebase
  .functions()
  .httpsCallable("admin_deleteComment");
export async function adminDeleteComment(commentId) {
  await cf_deleteComment(commentId);
}

const cf_addProduct = firebase.functions().httpsCallable("admin_addProduct");
export async function addProduct(product) {
  await cf_addProduct(product.serialize());
}

const cf_isAdmin = firebase.functions().httpsCallable("admin_checkAdmin");
export async function isAdmin(email) {
  const result = await cf_isAdmin(email);
  return result.data;
}

const cf_getUserList = firebase.functions().httpsCallable("admin_getUserList");
export async function getUserList() {
  const result = await cf_getUserList();
  return result.data;
}

const cf_updateUser = firebase.functions().httpsCallable("admin_updateUser");
export async function updateUser(uid, update) {
  await cf_updateUser({ uid, update });
}
