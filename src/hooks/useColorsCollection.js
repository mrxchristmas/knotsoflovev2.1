import { useState, useEffect } from 'react'
import { db } from '../firebase/config'

import { collection, getDocs, documentId, query, where, limit, orderBy } from 'firebase/firestore'


export const useColorsCollection = (persistSelectColors, colors, l=null) => {
    const [documents, setDocuments] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    useEffect( () => {
        let store = collection(db, 'colors')

        if(l){
            store = query(store, limit(l))
            store = query(store, orderBy("isAvailable", "desc"))
        }

        setIsPending(true)

        if(persistSelectColors){
            if(colors){
                store = query(store, where(documentId(), "in", colors))
                getDocs(store)
                .then(snapshot => {
                    // console.log(snapshot);
                    let resp = []
                    snapshot.docs.forEach(doc => {
                        resp.push({id: doc.id, ...doc.data()})
                    })
                    setDocuments(resp)
                })
                .catch(err => {
                    console.log(err)
                    setError('could not fetch data: ', err)
                })
            }
        }else{
            getDocs(store)
            .then(snapshot => {
                // console.log(snapshot);
                let resp = []
                snapshot.docs.forEach(doc => {
                    resp.push({id: doc.id, ...doc.data()})
                })
                setDocuments(resp)
            })
            .catch(err => {
                console.log(err)
                setError('could not fetch data: ', err)
            })
        }

        

        setIsPending(false)
        setError(null)

        // return () => unsub()
    }, [colors, persistSelectColors, l]);

    return { documents, isPending, error }
}
