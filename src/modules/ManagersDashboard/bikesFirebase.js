import {
    collection, query, orderBy, onSnapshot,
    addDoc, doc, Timestamp, deleteDoc, updateDoc
} from 'firebase/firestore'
import { db } from '../../firebase.js'

const createBikeinCollection = async (bikeDetails) => {
    return addDoc(collection(db, "bikes"), {
        model: bikeDetails.model,
        color: bikeDetails.color,
        location: bikeDetails.location,
        availableToRent: bikeDetails.availableToRent,
        imageUrl: bikeDetails.imageUrl,
        rating: 0
    })
};

function fetchAllBikesFromCollection() {
    return new Promise((resolve, reject) => {
        const q = query(collection(db, 'bikes'));
        onSnapshot(q, (querySnapshot) => {
            const bikes = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

            resolve(bikes);
        })
    })
}

function deleteBikeFromCollection(id) {
    let bikeRef = doc(db, 'bikes', id)
    return deleteDoc(bikeRef)
}

function updateBikeInCollection(id, data) {
    let bikeRef = doc(db, 'bikes', id)
    return updateDoc(bikeRef, data)
}

export {
    createBikeinCollection,
    fetchAllBikesFromCollection,
    deleteBikeFromCollection,
    updateBikeInCollection
};