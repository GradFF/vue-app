import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  //
}

initializeApp(firebaseConfig)
const db = getFirestore()
const auth = getAuth()

export { db, auth }

// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /urls/{id} {
//         allow read: if true;
//         allow update, delete: if request.auth != null && request.auth.uid == resource.data.user;
//         allow create: if request.auth != null;
//     }
//     match /users/{id} {
//         allow read, update, delete: if request.auth != null && request.auth.uid == id;
//         allow create: if request.auth != null;
//     }
//   }
// }
