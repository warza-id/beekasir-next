// Import the functions you need from the SDKs you need
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { localGet, localRemove, today } from "./helper";
import { Item, Trx, User } from "./model";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfigProd = {
  apiKey: "AIzaSyBIwg51nO3FYcJAhTGR7eZHZ3kkYv2UgoE",
  authDomain: "beekasir-60f31.firebaseapp.com",
  databaseURL: "https://beekasir-60f31-default-rtdb.firebaseio.com",
  projectId: "beekasir-60f31",
  storageBucket: "beekasir-60f31.appspot.com",
  messagingSenderId: "767478061624",
  appId: "1:767478061624:web:acbc798142d4814f0fe4cd",
  measurementId: "G-G7EQ64BJER"
};

const firebaseConfigDev = {
  apiKey: "AIzaSyC-KgDAvMSkk7Quw8oKVMhxLAp7V8xlMtM",
  authDomain: "beekasir.firebaseapp.com",
  databaseURL: "https://beekasir-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "beekasir",
  storageBucket: "beekasir.appspot.com",
  messagingSenderId: "690577079701",
  appId: "1:690577079701:web:6f8fd29caab9c6be594a9c",
  measurementId: "G-CS1W5SJVFG"
};

let appA: FirebaseApp;
let appB: FirebaseApp;

// Init App A (Default - Tanpa Nama)
if (getApps().length === 0) {
  appA = initializeApp(firebaseConfigProd);
} else {
  appA = getApp(); // Mengambil [DEFAULT]
}

// Init App B (Named App - Wajib pakai nama unik, misal 'SECONDARY')
// Kita cek dulu apakah app bernama 'SECONDARY' sudah ada agar tidak error
const existingApps = getApps();
const secondaryApp = existingApps.find(app => app.name === 'SECONDARY');

if (!secondaryApp) {
  appB = initializeApp(firebaseConfigDev, 'SECONDARY'); // <--- PERHATIKAN PARAMETER KEDUA
} else {
  appB = getApp('SECONDARY');
}

// Initialize Firebase

export const DB = getFirestore(appA);
export const AUTH = getAuth(appA);

export const DB_DEV = getFirestore(appB);
export const AUTH_DEV = getAuth(appB);

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