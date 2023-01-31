import { useState } from "react"
import { useRef } from 'react'
import ReactDOM from 'react-dom'
import '../helper/Toast.css'
import '../helper/Modal.css'

export const useModal = ( closeCallback=()=>{} )=>{


    const [modal, setModal] = useState(null)

    const modalRef = useRef(null)


    const closeModal = () =>{
        setModal(null)
        closeCallback()
    }

    const handleClick =e=>{
        if(e.target !== modalRef.current){
            return
        }else{
            closeModal();
        }
    }


    function showModal(modalContent){
        setModal(ReactDOM.createPortal((
            <div onClick={handleClick} className="modal-container-backdrop" ref={modalRef}>
                <div className="modal-container">
                    <img onClick={closeModal} src="/icons/xmark-solid.svg" alt="" className="modal-close" />
                    {modalContent}
                </div>
            </div>
        ), document.getElementById('modal')))
    }

    return { showModal, closeModal, modal }

}