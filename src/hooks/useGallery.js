import { useState, useEffect } from 'react'
import { db } from '../firebase/config'

import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'


export const useGallery = (categoryid) => {
    const [documents, setDocuments] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    useEffect( () => {
        let unsub = () => {}
        
        try {
            let store = collection(db, "items")
            setIsPending(true)

            store = query(store, where("category", "==", categoryid))
            store = query(store, orderBy("createdAt", "desc"))

            unsub = onSnapshot(store, snapshot => {
                let res = []
                // console.log(snapshot.docs);
                snapshot.docs.forEach(doc => {
                    res.push({id: doc.id, ...doc.data()})
                })
                setDocuments(res)
                return Promise.resolve("Dummy response to keep the console quiet");
            }, err => {
                console.log(err)
                setError('could not fetch data: ', err)
            })

            setIsPending(false)
            setError(null)
        } catch (error) {
            setIsPending(false)
            setError(error.message)
        }

        return () => unsub()
    }, [categoryid]);

    return { documents, isPending, error }
}
