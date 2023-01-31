import { useState, useEffect } from 'react'
import { db } from '../firebase/config'

import { collection, onSnapshot, query, where, doc, getDoc, documentId } from 'firebase/firestore'

import { useAuthContext } from './useAuthContext'

// USAGE 
// const { documents: favs } = useFavorite()

// basically a nested useDocument and useCollection


// might need to create new index if its a new orderBy query, see error message
export const useFavorite = () => {
    const [documents, setDocuments] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    const { user } = useAuthContext()

    useEffect( () => {
        let unsub = () => {}
        if(user){
            setIsPending(true)
            const docr = doc(db, 'users', user.uid)
            getDoc(docr).then(dr => {
                if(dr.data()){
                    console.log(dr.data())
                    let store = collection(db, 'items')
                    store = query(store, where( documentId(), "in", dr.data().favItems ))

                    unsub = onSnapshot(store, snapshot => {
                        let res = []
                        snapshot.docs.forEach(doc => {
                            res.push({id: doc.id, ...doc.data()})
                        })
                        setDocuments(res)
                    }, err => {
                        console.log(err)
                        setError('could not fetch data: ', err)
                    })
                }
            })
        }

        setIsPending(false)
        setError(null)

        return () => unsub()
    }, [user]);

    return { documents, isPending, error }
}
