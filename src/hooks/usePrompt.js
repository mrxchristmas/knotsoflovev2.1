import {  useState, useRef } from "react"
import ReactDOM from 'react-dom'
import '../helper/Toast.css'


export const usePrompt = () => {
    // usage >> 
    // import { useToast } from '../../hooks/useToast'
    // const { showToast, toast } = useToast(2000)
    // {toast} --> use this anywhere in your UI

    const [prompt, setPrompt] = useState(null)
    // const [passwordHQ, setPasswordHQ] = useState("")
    const passref = useRef()


    const promptChoice = async (title) =>{
        return new Promise((resolve, reject) => {
            const handleYesClick =()=>{
                setPrompt(null)
                resolve()
            }
            const handleNoClick =()=>{
                setPrompt(null)
                reject()
            }
    
            setPrompt(ReactDOM.createPortal((
                <div id="global-prompt" className="flex-col-center-center">
                    <div className="container flex-col-center-center">
                        <h3 className="title">{title}</h3>
                        <div className="choice flex-row-center-even">
                            <button className="btn-green" onClick={handleYesClick}>Yes</button>
                            <button className="btn-red" onClick={handleNoClick}>No</button>
                        </div>
                    </div>
                </div>
            ), document.getElementById('prompt')))

        });
    }

    const promptPassword = async({ title, placeholder }) => {
        return new Promise((resolve, reject) => {

            const handleSubmit =e=>{
                e.preventDefault()
                if(passref.current.value.length > 0){
                    setPrompt(null)
                    resolve(passref.current.value)
                }
            }
            const handleCancel =e=>{
                setPrompt(null)
                reject()
            }

    
            setPrompt(ReactDOM.createPortal((
                <div id="global-prompt" className="flex-col-center-center" >
                    <div className="container flex-col-center-center">
                        <h3 className="title">{title}</h3>
                        <div className="password w-100 flex-col-center-start">
                            <input className="input" type="password" placeholder={placeholder ? placeholder : "Enter Password"} ref={passref} />
                            <div className="w-100 mt-3 flex-row-center-between">
                                <button className="btn-red" onClick={handleCancel} >Cancel</button>
                                <button className="btn-green" onClick={handleSubmit} >Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            ), document.getElementById('prompt')))

        });
    }

    return { prompt, promptChoice, promptPassword  }
}
