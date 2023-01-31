import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase/config'

import { collection } from 'firebase/firestore'


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
