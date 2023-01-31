import { useReducer, useEffect, useState } from "react"
// import { collection, addDoc, doc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore'
// import { Timestamp } from "firebase/firestore"
import { storage } from '../firebase/config'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

let initState = {
    url: null,
    isPending: false,
    error: null,
    success: null
}
const storageReducer =(state, action)=>{
    // console.log('DINC', action)
    switch (action.type) {
        case 'IS_PENDING':
            return {isPending: true, url: null, success: false, error: null}
        case 'UPLOAD':
            return { isPending: false, url: action.payload, success: true, error: null}
        case 'DELETE':
            return { isPending: false, url: null, success: true, error: null}
        case 'ERROR':
            return { isPending: false, url: null, success: true, error: action.payload}
    
        default:
            return state
    }
}

export const useStorage =()=>{
    const [response, dispatch] = useReducer(storageReducer, initState)
    const [isCancelled, setIsCancelled] = useState(false)

    // only Dispatch If Not Cancelled
    const DINC = action =>{
        if(!isCancelled){
            dispatch(action)
        }
    }

    // adding document
    const addFile = async (path, file) =>{
        const storageRef = ref(storage, path);

        dispatch({
            type: 'IS_PENDING'
        })
        return new Promise((res, rej)=>{
            uploadBytes(storageRef, file).then((img) => {
                getDownloadURL(img.ref)
                .then(url => {
                    DINC({
                        type: 'ADDED_FILE',
                        payload: url
                    })
                    res(url)
                })
                .catch(err => {
                    DINC({
                        type: 'ERROR',
                        payload: err.message
                    })
                    rej(err.message)
                })
            })
            .catch(err => {
                DINC({
                    type: 'ERROR',
                    payload: err.message
                })
                rej(err.message)
            })
        })
    }

    // delete document
    const deleteFile = async url =>{
        const imgRef = ref(storage, url)
        dispatch({
            type: 'IS_PENDING'
        })
        return new Promise((res, rej)=>{
            deleteObject(imgRef).then(() => {
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
                rej(err.message)
            })
        })
    }



    useEffect(() => {

        return () => setIsCancelled(true)
    }, [])

    return {addFile, deleteFile, response}

}