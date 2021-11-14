const functions = require("firebase-functions");
const algoliasearch = require("algoliasearch");

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("The-Oasis-Users");

exports.addToIndex = functions.firestore
  .document("users/{username}")
  .onCreate((snapshot) => {
    const data = snapshot.data();
    const objectID = snapshot.id;

    return index.saveObject({ ...data, objectID });
  });

exports.updateIndex = functions.firestore
  .document("users/{username}")
  .onUpdate((change) => {
    const newData = change.after.data();
    const objectID = change.after.id;
    return index.saveObject({ ...newData, objectID });
  });

exports.deleteIndex = functions.firestore
  .document("users/{username}")
  .onDelete((snapshot) => index.deleteObject(snapshot.id));
