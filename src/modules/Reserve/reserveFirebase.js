import {
    collection, query, orderBy, onSnapshot,
    addDoc, doc, Timestamp, deleteDoc, updateDoc, where,
    runTransaction
} from 'firebase/firestore'
import { db } from '../../firebase.js'

const createReservationInCollection = async (details) => {
    const from_date_TimeStamp = Timestamp.fromDate(new Date(details.fromDate))
    const to_date_TimeStamp = Timestamp.fromDate(new Date(details.toDate))


    return addDoc(collection(db, "reservations"), {
        bikeId: details.bikeId,
        userId: details.userId,
        fromDate: from_date_TimeStamp,
        toDate: to_date_TimeStamp,
        model: details.model,
        location: details.location,
        color: details.color,
        imageUrl: details.imageUrl,
        hasRated: false,
        userEmail: details.userEmail
    })
};

function fetchAllReservationsFromCollection(uid) {
    return new Promise((resolve, reject) => {
        let q;
        if (uid) {
            q = query(collection(db, 'reservations'), where('userId', '==', uid));
        } else {
            q = query(collection(db, 'reservations'));
        }

        onSnapshot(q, (querySnapshot) => {
            const reservations = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

            resolve(reservations);
        })
    })
}

function fetchAllReservationsByBike(bikeId) {
    return new Promise((resolve, reject) => {
        const q = query(collection(db, 'reservations'), where('bikeId', '==', bikeId));

        onSnapshot(q, (querySnapshot) => {
            const reservations = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

            resolve(reservations);
        })
    })
}

// function fetchAllReservationsTimePeriod(fromDate, toDate) {
//     const from_date_TimeStamp = Timestamp.fromDate(new Date(fromDate))
//     const to_date_TimeStamp = Timestamp.fromDate(new Date(toDate))
//     return new Promise((resolve, reject) => {
//         const q = query(
//             collection(db, 'reservations'),
//             where('fromDate', '<=', from_date_TimeStamp),
//             where('toDate', '<=', to_date_TimeStamp)
//         )

//         onSnapshot(q, (querySnapshot) => {
//             const reservations = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
//             console.log(reservations, "From time period")
//             resolve(reservations);
//         })
//     })
// }

function deleteReservationFromCollection(id) {
    let resRef = doc(db, 'reservations', id)
    return deleteDoc(resRef)
}

function updateBikeRatingInCollection(id, rating) {
    let bikeRef = doc(db, 'bikes', id)

    return runTransaction(db, async (transaction) => {
        const bikeDoc = await transaction.get(bikeRef);
        if (!bikeDoc.exists()) {
            throw "Document does not exist!";
        }

        const newRating = bikeDoc.data().rating > 0 ? (bikeDoc.data().rating + rating) / 2 : rating;
        transaction.update(bikeRef, { rating: newRating });
    });
}


function updateHasRatedInCollection(id) {
    let resRef = doc(db, 'reservations', id)
    return updateDoc(resRef, {hasRated: true})
}


export {
    createReservationInCollection,
    fetchAllReservationsFromCollection,
    deleteReservationFromCollection,
    updateBikeRatingInCollection,
    updateHasRatedInCollection,
    fetchAllReservationsByBike
};