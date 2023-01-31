import { useEffect, useState } from "react"
import { db } from '../firebase/config'
import { doc, onSnapshot } from 'firebase/firestore'


export const useDocument =(collection, id)=>{
    const [document, setDocument] = useState(null)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(true)

    // realtime data for the document
    useEffect(() => {
        let unsub = ()=>{}
        try {
            unsub = onSnapshot(doc(db, collection, id), (snapshot) => {
                // console.log("Current data: ", snapshot.data());
                if(snapshot.data()){
                    setDocument({...snapshot.data(), id: snapshot.id})
                    setError(null)
                    setIsPending(false)
                }else{
                    setError('DOCUMENT_NOT_EXIST')
                    setIsPending(false)
                }
            });
        } catch (error) {
            setError('FAILED_DOCUMENT')
            setIsPending(false)
        }

        return () => unsub()

    }, [collection, id]);

    return { document, error, isPending }

}