import { useCallback, useEffect, useState } from "react"
import { useRef } from 'react'
import ReactDOM from 'react-dom'
import '../helper/Toast.css'

export const useToast =(timeout)=>{

    // usage >> 
    // import { useToast } from '../../hooks/useToast'
    // const { showToast, toast } = useToast(2000)
    // {toast} --> use this anywhere in your UI

    const [isShown, setIsShown] = useState(false)
    const [timer, setTimer] = useState(null)
    const [toast, setToast] = useState(null)

    const toastRef = useRef(null)

    const closeToast = useCallback(
        ()=>{
            setIsShown(false)
            clearTimeout(timer)
            setTimer(null)
            setToast(null)
        },
        [timer],
    )

    const handleClick =e=>{
        if(e.target !== toastRef.current){
            return
        }else{
            closeToast();
        }
    }

    useEffect(() => {
        setIsShown(false)
    }, [])


    useEffect(() => {
        if(isShown){
            clearTimeout(timer)
            setTimer(setTimeout(()=> {
                closeToast()
            }, timeout ? timeout : 2000))
        }

        return ()=>{
            clearTimeout(timer)
            setTimer(null)
        }
        // eslint-disable-next-line
    }, [isShown])
    


    function showToast({ message, style }){
        setIsShown(true)
        
        setToast(ReactDOM.createPortal((
            <div onClick={handleClick} className="toast-container flex-row-center-center" ref={toastRef}>
                <span style={style} onClick={closeToast} >{message}</span>
            </div>
        ), document.getElementById('toast')))
    }

    return { showToast, toast }

}