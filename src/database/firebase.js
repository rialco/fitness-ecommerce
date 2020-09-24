import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
firebase.initializeApp(config);

export const auth = firebase.auth();

export const firestore = firebase.firestore();

export const storage = firebase.storage();

export default firebase;

export const createUserDocument = async (userAuth, userData) => {
  if (!userAuth) return;

  const userRef = firestore.collection("users").doc(userAuth.uid);
  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const createdAt = new Date().getTime();

    try {
      await userRef.set({
        createdAt,
        ...userData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

export const updateUserDocument = async (userAuth, field, data) => {
  if (!userAuth) return;
  const userRef = firestore.collection("users").doc(userAuth.uid);

  try {
    await userRef.update({ [field]: data });
  } catch (error) {
    console.log("Error updating user", error.message);
  }
};

export const createOrderDocument = async (orderData, files) => {
  const createdAt = new Date().getTime();
  let docRef;
  let uploadTasks = [];
  docRef = await firestore.collection("pendingPayment").add({
    createdAt,
    ...orderData,
  });
  if (files) {
    files.forEach((file) => {
      uploadTasks.push(
        storage
          .ref()
          .child("/orderFiles/" + docRef.id + "/userFiles/" + file.name)
          .put(file)
      );
    });
  }
  return { uploadTasks, docRef };
};

export const createCustomOrder = async (orderData) => {
  const createdAt = new Date().getTime();
  let validUser = false;
  let docRef;

  const uID = await getUserIDWithEmail(orderData.userEmail);

  if (uID) {
    delete orderData.userEmail;
    validUser = true;
    orderData.user = uID;
    docRef = await firestore.collection("pendingPayment").add({
      createdAt,
      ...orderData,
    });
    return { validUser, docRef };
  } else {
    return { validUser };
  }
};

export const createProductDocument = async (product, productAddons, files) => {
  const newProduct = {
    ...product,
    productAddons: productAddons,
    name: product.productName,
  };

  delete newProduct.productName;
  const createdAt = new Date().getTime();
  let uploadTasks = [];
  const productsRef = firestore.collection("products");

  const docRef = await productsRef.add({
    ...newProduct,
    creationDate: createdAt,
  });

  if (files) {
    files.forEach((file) => {
      uploadTasks.push(
        storage
          .ref()
          .child("/productImages/" + docRef.id + "/" + file.name)
          .put(file)
      );
    });
  }
  return { uploadTasks, docRef };
};

export const fetchProducts = async () => {
  const producstRef = firestore.collection("products");

  let productos = [];

  await producstRef.get().then((snapshot) => {
    snapshot.forEach((doc) => {
      productos.push({ data: doc.data(), id: doc.id });
    });
  });

  try {
    return productos;
  } catch (error) {
    console.log(error);
  }
};

export const fetchOrder = async (orderState, orderID) => {
  let orderDetails = {};
  const orderRef = firestore.collection(orderState).doc(orderID);
  await orderRef.get().then((snapshot) => {
    if (snapshot.exists) {
      orderDetails = snapshot.data();
      orderDetails.id = snapshot.id;
    }
  });
  return orderDetails;
};

export const sendOrderMessage = async (orderID, messageObj) => {
  const newMessage = { ...messageObj };
  const sendTime = new Date().getTime();

  const msgRef = firestore
    .collection("orderMessages")
    .doc(orderID)
    .collection("messages");
  await msgRef.add({ ...newMessage, sendTime: sendTime });
};

export const getUserIDWithEmail = async (userEmail) => {
  const userRef = firestore.collection("users").where("email", "==", userEmail);

  const u = await userRef.get();
  let uID = null;

  if (u.empty === false) {
    u.docs.forEach((item) => {
      uID = item.id;
    });
  } else {
    return null;
  }

  return uID;
};

export const setProvider = async (orderID, orderState, providerID) => {
  const prevOrderRef = firestore.collection(orderState).doc(orderID);
  const newOrderRef = firestore.collection("inProcess").doc(orderID);
  let orderDetails = {};
  let updated = false;

  const prevOrderSnapshot = await prevOrderRef.get();
  const newOrderSnapshot = await newOrderRef.get();

  if (prevOrderSnapshot.exists) {
    orderDetails = prevOrderSnapshot.data();
    orderDetails.providerID = providerID;
  }

  if (!newOrderSnapshot.exists) {
    try {
      await newOrderRef.set({
        ...orderDetails,
      });
      prevOrderRef.delete();
      updated = true;
    } catch (error) {
      console.log("error setting provider", error.message);
    }
  } else if (orderState === "inProcess" && newOrderSnapshot.exists) {
    try {
      await newOrderRef.update({
        providerID: providerID,
      });
      updated = true;
    } catch (error) {
      console.log("error setting provider", error.message);
    }
  }

  return updated;
};

export const adminPaidOrder = async (isAdmin, orderID) => {
  if (isAdmin) {
    const prevOrderRef = firestore.collection("pendingPayment").doc(orderID);
    const newOrderRef = firestore.collection("pendingClaim").doc(orderID);
    let orderDetails = {};
    let updated = false;

    const prevOrderSnapshot = await prevOrderRef.get();
    const newOrderSnapshot = await newOrderRef.get();

    if (prevOrderSnapshot.exists) {
      orderDetails = prevOrderSnapshot.data();
      orderDetails.paymentDate = new Date().getTime();
    }

    if (!newOrderSnapshot.exists) {
      try {
        await newOrderRef.set({
          ...orderDetails,
        });
        prevOrderRef.delete();
        updated = true;
      } catch (error) {
        console.log("error pagando la orden", error.message);
      }
    }
    return updated;
  }
};

export const adminApprovedOrder = async (isAdmin, orderID) => {
  if (isAdmin) {
    const prevOrderRef = firestore.collection("inProcess").doc(orderID);
    const newOrderRef = firestore.collection("completed").doc(orderID);
    let orderDetails = {};
    let updated = false;

    const prevOrderSnapshot = await prevOrderRef.get();
    const newOrderSnapshot = await newOrderRef.get();

    if (prevOrderSnapshot.exists) {
      orderDetails = prevOrderSnapshot.data();
    }

    if (!newOrderSnapshot.exists) {
      try {
        await newOrderRef.set({
          ...orderDetails,
        });
        prevOrderRef.delete();
        updated = true;
      } catch (error) {
        console.log("error completando la orden", error.message);
      }
    }
    return updated;
  }
};

export const getUserInfoWithID = async (isAdmin, userID) => {
  if (!isAdmin) return;
  let userInfo = {};
  const userRef = firestore.collection("users").doc(userID);
  const snapShot = await userRef.get();

  if (snapShot.exists) {
    userInfo.email = snapShot.data().email;
    userInfo.phone = snapShot.data().phone ? snapShot.data().phone : "N/A";
  }

  return userInfo;
};

export const updateUserRole = async (userID, providerState) => {
  let updated = false;
  const userRef = firestore.collection("users").doc(userID);
  const snapShot = await userRef.get();

  if (snapShot.exists) {
    try {
      userRef.update({ isAdmin: !providerState });
      updated = true;
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return updated;
};

export const getProducts = async () => {
  const productsRef = firestore.collection("products");
  const snapshot = await productsRef.get();

  let products = [];

  snapshot.docs.forEach((doc) => {
    products.push(doc.data());
  });

  return products;
};

export const deleteOrderID = async (orderID, orderState, isAdmin) => {
  if (!isAdmin) return;
  const orderRef = firestore.collection(orderState).doc(orderID);
  let deleted = false;

  try {
    await orderRef.delete();
    deleted = true;
  } catch (error) {
    console.log(error.message);
  }

  return deleted;
};

export const deleteProduct = async (productID, isAdmin) => {
  if (!isAdmin) return;
  const productRef = firestore.collection("products").doc(productID);
  let deleted = false;

  try {
    await productRef.delete();
    deleted = true;
  } catch (error) {
    console.log(error.message);
  }

  return deleted;
};

export const createTransactionAttempt = async (pseObj, orderID) => {
  const createdAt = new Date().getTime();
  const transactionsRef = firestore
    .collection("pseTransactionAttempt")
    .doc(orderID);

  await transactionsRef.set({ ...pseObj, creationDate: createdAt });
  return transactionsRef.id;
};

export const getDownloadUrl = async (orderID, docType) => {
  const docLocation = docType === "user" ? "userFiles" : "providerFiles";

  var listRef = storage.ref("/orderFiles/" + orderID + "/" + docLocation + "/");
  const fileList = await listRef.listAll();

  try {
    if (fileList.items.length > 0) {
      return await fileList.items[0].getDownloadURL();
    }
  } catch (er) {
    console.log(er);
  }
};

export const deletePrevFiles = async (orderID) => {
  const docLocation = "providerFiles";

  var listRef = storage.ref("/orderFiles/" + orderID + "/" + docLocation + "/");
  const fileList = await listRef.listAll();

  try {
    if (fileList.items.length > 0) {
      fileList.items.forEach(async (fi) => {
        await fi.delete();
      });
      return true;
    }
  } catch (er) {
    console.log(er);
  }
};

export const getProviderRating = async (currentProviderID) => {
  const ordersRef = firestore
    .collection("completed")
    .where("providerID", "==", currentProviderID);

  let counter = 0;
  let rating = 0;
  let orders = await ordersRef.get();
  orders.docs.forEach((doc) => {
    if (typeof doc.data().rating !== "undefined") {
      counter = counter + 1;
      rating = rating + doc.data().rating;
    }
  });
  return rating / counter;
};

export const updateProviderRating = (newRating) => {};

export const rateOrder = async (newRating, orderID) => {
  let updated = false;
  const orderRef = firestore.collection("completed").doc(orderID);
  const snapShot = await orderRef.get();

  if (snapShot.exists) {
    try {
      orderRef.update({ rating: newRating });
      updated = true;
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }
  return updated;
};
