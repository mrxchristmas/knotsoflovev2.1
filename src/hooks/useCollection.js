import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase/config'

import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore'

// USAGE 
// useCollection('books', [['uid', '==', user.uid]], ["title", "desc"] )
// [['uid', '==', user.uid], ['title', '==', 'happy feet']] for where or _q
// [ ['title'], ['likes', 'asc' ] ] for orderby or _o
// l must be a number

// USAGE FOR getting multiple id in a collection
// import { documentId } from 'firebase/firestore'
// const xxx = ["07Ew4Vdx5MSbB6rG8A4S", "12vUpr2dSq42jn5Wic8I", "1vRugt103vzftKnwVsGh"]
// const { documents: items } = useCollection('items', [ [documentId(), "in", xxx ] ])


// < less than
// <= less than or equal to
// == equal to
// > greater than
// >= greater than or equal to
// != not equal to
// array-contains
// array-contains-any
// in
// not-in
// https://firebase.google.com/docs/firestore/query-data/queries
// https://firebase.google.com/docs/firestore/query-data/order-limit-data


// might need to create new index if its a new orderBy query, see error message
export const useCollection = (c, _q, _o, l) => {
    const [documents, setDocuments] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    const q = useRef(_q).current
    const o = useRef(_o).current


    useEffect( () => {
        let store = collection(db, c)
        setIsPending(true)

        if(q){
            q.forEach(qq => {
                store = query(store, where(...qq))
            })
        }
        if(o){
            o.forEach(oo => {
                store = query(store, orderBy(...oo))
            })
        }
        if(l){
            store = query(store, limit(l))
        }


        // store = query(store, where("category", "==", "0LUvLcpM5rYCaAzgPv2c"))

        
        const unsub = onSnapshot(store, snapshot => {
            let res = []
            snapshot.docs.forEach(doc => {
                res.push({id: doc.id, ...doc.data()})
            })
            setDocuments(res)
        }, err => {
            console.log(err)
            setError('could not fetch data: ', err)
        })

        setIsPending(false)
        setError(null)

        return () => unsub()
    }, [c, q, o, l]);

    return { documents, isPending, error }
}
