import { useReducer, useEffect, useState } from "react"
import { collection, addDoc, doc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore'
import { Timestamp } from "firebase/firestore"
import { db } from '../firebase/config'

let initState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}
const firestoreReducer =(state, action)=>{
    // console.log('DINC', action)
    switch (action.type) {
        case 'IS_PENDING':
            return {isPending: true, document: null, success: false, error: null}
        case 'ADDED_DOC':
            return { isPending: false, document: action.payload, success: true, error: null}
        case 'DELETED_DOC':
            return { isPending: false, document: null, success: true, error: null}
        case 'UPDATED_DOC':
            return { isPending: false, document: action.payload, success: true, error: null}
        case 'ERROR':
            return { isPending: false, document: null, success: true, error: action.payload}
    
        default:
            return state
    }

}

export const useFirestore =(c)=>{
    const [response, dispatch] = useReducer(firestoreReducer, initState)
    const [isCancelled, setIsCancelled] = useState(false)

    //collection reference
    const store = collection(db, c)

    // only Dispatch If Not Cancelled
    const DINC = action =>{
        if(!isCancelled){
            dispatch(action)
        }
    }

    // adding document
    const addDocument = async doc =>{
        dispatch({
            type: 'IS_PENDING'
        })

        return new Promise((res, rej)=>{
            const createdAt = Timestamp.fromDate(new Date())
            addDoc(store, {...doc, createdAt}).then(addedDoc => {
                DINC({
                    type: 'ADDED_DOC',
                    payload: addedDoc
                })
                res()
            })
            .catch( err => {
                DINC({
                    type: 'ERROR',
                    payload: err.message
                })
                rej()
            })
        })
    }
    

    // delete document
    const deleteDocument = async id =>{
        const ref = doc(db, c, id)

        dispatch({
            type: 'IS_PENDING'
        })

        return new Promise((res, rej)=>{
            deleteDoc(ref)
            .then(() => {
                DINC({
                    type: 'DELETED_DOC'
                })
                res()
            })
            .catch(err => {
                DINC({
                    type: 'ERROR',
                    payload: err.message
                })
                rej()
            })
        })
    }

    // set document | will create doc if it doesnt exist ( good for creating docs with custom id )
    const setDocument = async (id, d) =>{
        dispatch({
            type: 'IS_PENDING'
        })
        const ref = doc(db, c, id)
        const createdAt = Timestamp.fromDate(new Date())

        setDoc(ref, {...d, createdAt})
        .then(res => {
            DINC({
                type: 'UPDATED_DOC',
                payload: res
            })
        })
        .catch(err => {
            DINC({
                type: 'ERROR',
                payload: err.message
            })
        })
    }

    // update document | will fail if doc does not exist
    const updateDocument = async (id, d) =>{
        dispatch({
            type: 'IS_PENDING'
        })
        const ref = doc(db, c, id)
        const createdAt = Timestamp.fromDate(new Date())

        return new Promise((resolve, reject)=>{
            updateDoc(ref, {...d, createdAt})
            .then(res => {
                DINC({
                    type: 'UPDATED_DOC',
                    payload: res
                })
                resolve()
            })
            .catch(err => {
                DINC({
                    type: 'ERROR',
                    payload: err.message
                })
                reject()
            })
        });
        
    }



    useEffect(() => {

        return () => setIsCancelled(true)
    }, [])

    return {addDocument, deleteDocument, setDocument, updateDocument, response}

}