// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { localGet, localRemove, today } from "./helper";
import { Item, Trx, User } from "./model";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-KgDAvMSkk7Quw8oKVMhxLAp7V8xlMtM",
  authDomain: "beekasir.firebaseapp.com",
  databaseURL: "https://beekasir-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "beekasir",
  storageBucket: "beekasir.appspot.com",
  messagingSenderId: "690577079701",
  appId: "1:690577079701:web:3b2967e6733ca6ef594a9c",
  measurementId: "G-LM8GHHHQCZ"
};

// Initialize Firebase
const APP = initializeApp(firebaseConfig);
export const DB = getFirestore(APP);
export const AUTH = getAuth(APP);

export function refProduct() {
  const user = localGet('@user');
  
  
  return 'Company/' + user.companyId + '/Branch/' + user.branchId + '/Products';
}

export function refTrx() {
  const user = localGet('@user');
  
  
  return 'Company/' + user.companyId + '/Transactions';
}

export function refItems() {
  const user = localGet('@user');
  
  
  return 'Company/' + user.companyId + '/Items';
}

export function getSessionUser() : User {
  const user = localGet('@user');
  
  return user;
}

export const submitTransaction = async() => {

  try {
      const ref1 = refTrx();
      var data : Trx = localGet('@trx');
      
      const trx = doc(DB, ref1 + '/' + data.trxId);
      
      const saveTrx = await setDoc(trx, data);
      console.log(saveTrx);

      submitItems();
    return true;
  } catch (error) {
      console.log(error);
      return false;
  }
}

export const submitItems = async() => {

  try {

      const ref2 = refItems();
      var newItems = [];
      newItems = localGet('@items');

      const batch = writeBatch(DB);
      newItems.forEach( (d : Item) => {
          const item = doc(DB, ref2 + '/' + d.id);
          d.createdDate = today();
          batch.set(item, d);
      });
      batch.commit();

  } catch (error) {
      console.log(error);
      return false;
  }
}