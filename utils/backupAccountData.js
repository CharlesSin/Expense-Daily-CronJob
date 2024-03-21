import fireConfig from "../config/firebaseConnect.config";

// Backup data from firebase.
async function backupAccountData(collectionName) {
  const firestoreDb = fireConfig.firestore();
  const querySnapshot = await firestoreDb.collection(`${collectionName}`).get();

  let accountObj = [];

  querySnapshot.forEach((doc) => {
    const documentItem = doc.data();
    documentItem.id = doc.id;
    accountObj.push(documentItem);
  });

  return accountObj;
}

export default backupAccountData;
