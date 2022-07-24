// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    onSnapshot,
    doc, deleteDoc, updateDoc
} from "firebase/firestore";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    admin,
    signOut,
} from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCsxGJMFj4wTK_qc_R6PMrrNPHdIea39rA",
    authDomain: "bike-rental-a7210.firebaseapp.com",
    projectId: "bike-rental-a7210",
    storageBucket: "bike-rental-a7210.appspot.com",
    messagingSenderId: "585727614078",
    appId: "1:585727614078:web:03e10e628d3bf9f1d68c2f",
    measurementId: "G-TD3E8WPGK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// auth related functions

const logInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
};

const registerWithEmailAndPassword = async (email, password, role, fullName) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(res => {
            const user = res.user;

            addDoc(collection(db, "users"), {
                uid: user.uid,
                role,
                fullName,
                authProvider: "local",
                email,
            })
        })
};

function getUserDataFromStore(uid) {
    return new Promise((resolve, reject) => {
        const q = query(collection(db, 'users'), where('uid', '==', uid));
        onSnapshot(q, (querySnapshot) => {
            const userRole = querySnapshot.docs[0].data().role;
            resolve(userRole);
        })
    })
}

function fetchAllUsersByRoleFromStore(role) {
    return new Promise((resolve, reject) => {
        const q = query(collection(db, 'users'), where('role', '==', role));
        onSnapshot(q, (querySnapshot) => {
            const users = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

            resolve({users: users, role});
        })
    })
}

function deleteUserFromCollection(id) {
    let userRef = doc(db, 'users', id)
    return deleteDoc(userRef)
}

function updateUserInCollection(id, data) {
    let userRef = doc(db, 'users', id)
    return updateDoc(userRef, data)
}

const logout = () => {
    signOut(auth);
};

export {
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
    getUserDataFromStore,
    fetchAllUsersByRoleFromStore,
    deleteUserFromCollection,
    updateUserInCollection
};

// const analytics = getAnalytics(app);