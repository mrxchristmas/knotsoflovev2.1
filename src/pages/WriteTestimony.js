

import { Link, useParams } from "react-router-dom"
import { useDocument } from "../hooks/useDocument"
import { useEffect, useState } from "react"
import { useFirestore } from "../hooks/useFirestore"
import { useAuthContext } from "../hooks/useAuthContext"


export default function WriteTestimony() {

    const { theme } = useAuthContext()
    const { testimonyid } = useParams()
    const { document } = useDocument('testimony', testimonyid)
    const { setDocument } = useFirestore('testimony')

    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [emailTest, setEmailTest] = useState("");
    const [emailTestComplete, setEmailTestComplete] = useState(false);

    // noelsantillan.com@gmail.com
    // HOHOHOH the items were definitely amazing! would love to purchase again! will definitely 

    useEffect(() => {
        if(document){
            console.log(document);
        }
    }, [document]);

    useEffect(() => {
        if(document && emailTest === document.writerEmail){
            console.log('amazing')
            setEmailTestComplete(true)
            setTimeout(() => {
                setIsOpen(true)
                setTimeout(() => {
                    setIsOpen2(true)
                    setTimeout(() => {
                        setIsOpen3(true)
    
                    }, 1000);
                }, 1000);
            }, 1000);
        }
    }, [emailTest, document]);


    const handleSubmit = e => {
        const testimony = e.target.previousElementSibling.value

        setDocument(document.id, { ...document,
            testimony,
            isAvailable: false
        })
        .then(() => {
            console.log('ok');
            e.target.previousElementSibling.value = ""
        })
        .catch(() => {
            console.log('err');
        })
    }

    

    return (<>
        {document && document.isAvailable &&
            <div className={`write-testimony-main container flex-col-center-start mt-4 ${theme}`}>
                    <h2>We're glad to have you here,</h2>
                    <div className="flex-col-center-center w-70 mt-2 mb-3">
                        <img className="writerPhotoURL" src={document.writerPhotoURL} alt="" referrerPolicy="no-referrer" />
                        <h3>{document.writerName}</h3>
                    </div>
                <div className={`phase1 flex-col-center-start ${isOpen && "close"} ${isOpen2 && "hide"}`}>
                    <p className="mt-2">Ready to write your Testimony? Please enter your email first to verify your identity</p>
                    <input disabled={emailTestComplete} value={emailTest} onChange={e => setEmailTest(e.target.value)} type="text" className="input emailTest mt-1" placeholder="Email" />
                    <h3 className={`mt-2 text-green emailTestPass ${emailTestComplete && "pass"}`}>You're All set!</h3>
                </div>
                <div className={`phase2 flex-col-center-start ${isOpen3 && "open"}`}>
                    <h3>These are the items you bought</h3>
                    <p  className="mb-1 minitext">Click to View Item in New Tab</p>
                    {document.items.map(item => (
                        <Link to={`/item/${item.id}`} target="_blank" referrerPolicy="norefferrer" key={item.id} className={`itemwidget w-90 p-1-2 flex-row-center-between ${theme === "dark" ? "bg-darkaccent text-white" : "bg-white text-black"}`}>
                            <p>{item.name}</p>
                            <p>${item.salePrice}</p>
                        </Link>
                    ))}
                    
                    <textarea className={`input mt-1 `} placeholder="Here are some questions to help you with your Testimony. 1) How do you like the items you bought? 2) where did you learn of us? eg. social media, friends etc. 3) are you willing to refer us to your friends and collegues?"></textarea>
                    <button onClick={handleSubmit} className="btn-green mt-1">Submit</button>
                </div>

            </div>
        }
        {document && !document.isAvailable && 
            <div className={`write-testimony-main container flex-col-center-start mt-4 ${theme}`}>
                <h1>We appreciate you writing a Testimony for us!</h1>
                <h2 className="mt-1">You're qualified for a $5 OFF discount on your next purchase</h2>
                <h3 className="mt-1">See you! Till then</h3>
                <span className="mt-5">looks like you've finished writing your Testimony, </span>
                <span className="">If you think this is an Error please send us a quick message!</span>
                <span className="mt-5">best regards,</span>
                <span className="">Kaye</span>
            </div>
        }
        {document === null && 
            <div className={`write-testimony-main container flex-col-center-start mt-4 ${theme}`}>
                <h1>Nothing here but Knots and Love</h1>
            </div>
        }
    
    </>)
}
