import { useEffect, useRef, useState } from "react"
import { useCollection } from "../hooks/useCollection"
// import { useImage } from '../hooks/useImage'
import { useAuthContext } from "../hooks/useAuthContext"
import { Timestamp } from "firebase/firestore"
import { rngPassword } from "../helper/helper"
import { useFirestore } from "../hooks/useFirestore"
import { usePrompt } from "../hooks/usePrompt"
import { useToast } from "../hooks/useToast"
import { Link } from "react-router-dom"
import { useIsMobile } from "../hooks/useIsMobile"
import { Envelope, PaperPlane, Settings } from "../helper/iconhelper"
import anon from '../assets/anonymous.jpg'

export default function ManageMessages() {

    const { isMobile } = useIsMobile()

    const { documents } = useCollection('orders')
    const { user, theme } = useAuthContext()
    const { setDocument, deleteDocument } = useFirestore('orders')
    const { addDocument : addSalesDocument } = useFirestore('sales')

    const { prompt, promptChoice } = usePrompt()
    const { toast, showToast } = useToast()

    const [orders, setOrders] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [conversation, setConversation] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [isNavOpen, setIsNavOpen] = useState(true);

    const contentRef = useRef()

    // const { ImageLoader } = useImage()
    console.log(orders);

    useEffect(() => {
        if(documents){
            // console.log(documents);
            setOrders(documents)
            contentRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [documents]);

    useEffect(() => {
        contentRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [isSettingsOpen, isNavOpen]);

    useEffect(() => {
        if(selectedOrder){
            orders.forEach(o => {
                if(o.id === selectedOrder.id){
                    setIsSettingsOpen(false)
                    setSelectedOrder(o)
                    setConversation(o.messages.sort((a,b) => a.createdAt < b.createdAt))
                    contentRef.current?.scrollIntoView({behavior: 'smooth'});
                }
            })
        }
    }, [selectedOrder, orders]);

    useEffect(() => {
        setIsNavOpen(true)
    }, []);

    const getNotif = (order) => {
        let x = 0
        order.messages.forEach(om => {
            let y = true
            om.read.forEach(id => {
              if(id === user.uid) y = false
            })
            y && x++
        })
        return x
    }

    const handleSendMessage = e => {
        let xxx 
        if(e.target.tagName === "svg"){
            xxx = e.target.previousElementSibling
        }else{
            xxx = e.target.parentElement.previousElementSibling
        }
        const m = xxx.value

        const messages = {
            id: rngPassword(),
            createdAt: Timestamp.now(),
            sender: user.uid,
            message: m,
            read: [user.uid],
        }
        setDocument(selectedOrder.user.id, { ...selectedOrder,
            messages: [...selectedOrder.messages, messages]
        })
        .then(() => {
            console.log('ok');
            xxx.value = ""
        })
        .catch(() => {
            console.log('err');
        })
    }

    const handleMarkAsRead = () => {
        let ret = []
        selectedOrder.messages.forEach(som => {
            let y = true
            som.read.forEach(sr => {
                if(sr === user.uid) y = false
            })
            y ? ret.push({...som, read: [...som.read, user.uid]}) : ret.push(som)
        })

        console.log(ret);
        setDocument(selectedOrder.user.id, { ...selectedOrder,
            messages: ret
        })
    }

    const handleRemoveItemClick = itemid => {
        // console.log(itemid);
        promptChoice("Confirm remove of this item")
        .then(() => {
            setDocument(selectedOrder.user.id, { ...selectedOrder,
                items: selectedOrder.items.filter(i => i.id !== itemid)
            })
            .then(() => {
                console.log('ok');
            })
            .catch(() => {
                console.log('err');
            })
        })
        .catch(() => {

        })
    }

    const handleSaleCompleteClick = (e, item) => {
        const p = e.target.previousElementSibling.value
        const data = {
            buyerid: selectedOrder.user.id,
            buyerName: selectedOrder.user.name,
            buyerPhotoURL: selectedOrder.user.photoURL,
            buyerEmail: selectedOrder.user.email,
            item: item,
            itemid: item.id,
            salePrice: p === "" ? parseFloat(item.price) : parseFloat(p),
            receiptTag: selectedOrder.receiptTag
        }
        console.log(data);
        addSalesDocument(data).then(() => {
            showToast({
                message: "Successfully Added Sales Record..."
            })

            let ret = []
            selectedOrder.items.forEach(soi => {
                let y = false
                if(soi.id === item.id) y = true
                y ? ret.push({...soi, isSold: true}) : ret.push(soi)
            })
            // console.log(ret);
            setDocument(selectedOrder.user.id, { ...selectedOrder,
                items: ret
            })
            .then(() => {
                showToast({
                    message: "Sale Completed! Invoice Management will show at Sales"
                })
            })
            .catch(() => {
                showToast({
                    message: "An Error has Occured while updating Item State"
                })
            })
        })
        .catch(() => {
            showToast({
                message: "An Error has Occured while adding Sales Record..."
            })
        })
    }

    const handleOrderCloseClick = () => {
        console.log(selectedOrder)
        promptChoice("Confirm Close Order")
        .then(() => {

            const nd = {
                id: selectedOrder.id,
                items: selectedOrder.items,
                messages: selectedOrder.messages,
                user: selectedOrder.user
            }
            setDocument(selectedOrder.id, {...nd,
                isClosed: true
            })
            .then(() => {
                showToast({message: "Order Successfully Closed"})
            })
            .catch((err) => {
                showToast({message: `There was an error Closing the Order: ${err.message }`})
            })
        })
    }

    const handleOrderDeleteClick = () => {
        promptChoice("Confirm Delete Record")
        .then(() => {
            deleteDocument(selectedOrder.id)
            .then(() => {
                showToast({message: "Record Successfully Deleted"})
                setSelectedOrder(null)
                setIsSettingsOpen(false)
            })
            .catch((err) => {
                showToast({message: `There was an error Deleting the Record: ${err.message }`})
            })
        })
    }

    const showNavQuery = () => {
        if(isMobile){
            if(isNavOpen){
                return true
            }else{
                return false
            }
        }else{
            return true
        }
    }

    return (
        <div className={`manage-messages-main container w-100 mt-1 flex-${isMobile ? "col-start-between mobile" : "row-start-between"} ${theme}`}>
            {prompt}
            {toast}
            {showNavQuery() && 
                <div className={`left bg-white ${isMobile && "mobile"}`}>
                    {isMobile &&
                        <div onClick={() => setIsNavOpen(false)} className="widget close p-1 bg-white flex-rowr-center-start">
                            <img src="/icons/xmark-solid.svg" referrerPolicy="no-referrer" alt="" />
                            <span className="mr-1">{`Close`}</span>
                        </div>
                    }
                    {orders && orders.length > 0 ? orders.map(order => (
                        <div onClick={() => {
                            setSelectedOrder(order)
                            setIsNavOpen(false)
                        }} key={order.id} className="widget p-1 flex-row-center-start">
                            {getNotif(order) > 0 && <p className="counter flex-col-center-center">{getNotif(order)}</p>}
                            {/* <ImageLoader url={order.user.photoURL} /> */}
                            <img src={order.user.photoURL ? order.user.photoURL : anon} referrerPolicy="no-referrer" alt="" />
                            <span>{order.user.name}</span>
                        </div>
                        )) : <div className="widget p-1 flex-row-center-center">
                            <span>No Orders</span>
                        </div>
                    }
                </div>
            }
            {isMobile && <button onClick={() => setIsNavOpen(true)} className="btn-green">Select Message</button>}
            <div className={`right ${isMobile ? "w-100 mt-1" : "w-70"} flex-col-center-start`}>
                {selectedOrder && conversation && <>
                    <div className="header bg-white flex-row-center-between">
                        <span className="name">{selectedOrder.user.name}</span>
                        <div className="flex-row-center-center">
                            {getNotif(selectedOrder) > 0 && <span onClick={() => handleMarkAsRead()} className="markasread mr-1">mark as read</span>}
                            {/* <img onClick={() => setIsSettingsOpen(!isSettingsOpen)} src={`/icons/${isSettingsOpen ? "envelope-solid" : "settings_black_48dp"}.svg`} alt="" /> */}
                            {isSettingsOpen ? 
                                <Envelope className="img" color={theme === "dark" ? "white" : "black"} onClick={() => setIsSettingsOpen(!isSettingsOpen)} /> : 
                                <Settings className="img" color={theme === "dark" ? "white" : "black"} onClick={() => setIsSettingsOpen(!isSettingsOpen)} />
                            }
                        </div>
                    </div>
                    {!isSettingsOpen && 
                        <div className="content bg-white flex-col-center-start">
                            {conversation.map(msg => (
                                <span key={msg.id} className={`bubble  ${msg.sender === user.uid ? "receiver bg-blue text-white" : "sender bg-whitesmoke"}`}>{msg.message}</span>
                            ))}
                            {selectedOrder.fromContactPage && <a href={`mailto:${selectedOrder.user.email}`} className="bubble sender bg-whitesmoke">{`Please Click here to Reply or send email to : ${selectedOrder.user.email}`}</a>}
                            {selectedOrder.fromContactPage && <span className="bubble sender bg-whitesmoke">Please Delete this Conversation when you're done.</span> }
                            <div ref={contentRef} />
                        </div>
                    }{isSettingsOpen && 
                        <div className="content bg-white flex-col-start-start">
                            <p className="minitext mt-1 text-red">{`*Please input sale price of the item if discounted -- before you click on "Sale Complete", if not, it will be defaulted to its original price`}</p>
                            <p className="minitext ">{`*All Sales will be shown under Management > Sales`}</p>
                            <p className="minitext ">{`*Close orders after checkout or if cancelled by the buyer.`}</p>
                            {selectedOrder && selectedOrder.items.map(soi => (
                                <div key={soi.id} className="mmmrcq-items-widget w-100 flex-col-start-start">
                                    <span className="name flex-row-center-start">
                                        {soi.name} - ${soi.price} 
                                        <Link target="_blank" rel="noreferrer" className="mmmrcq-items-widget-link bg-yellow ml-1 text-white" to={`/item/${soi.id}`}> Item Link</Link> 
                                    </span>
                                    <div className="button-action-container pb-1 w-100 flex-row-center-start">
                                        {!soi.isSold && <>
                                            <button onClick={() => handleRemoveItemClick(soi.id)} className="btn-red mr-1">Remove Item</button>
                                            <span className="mr-1 ml-2">$</span>
                                            <input className="input" type="number" placeholder={soi.price} />
                                        </>}
                                        {soi.isSold ? <button disabled className="btn-blue mr-1">Sale Completed</button>
                                         : <button onClick={e => handleSaleCompleteClick(e, soi)} className="btn-green mr-1">Sale Complete</button>}
                                    </div>
                                </div>
                            ))}
                            {selectedOrder && !selectedOrder.isClosed && 
                                <button onClick={() => handleOrderCloseClick()} className="btn-black text-white mt-1">Close Order</button>
                            }
                            <button onClick={() => handleOrderDeleteClick()} className="btn-red text-white mt-1">Delete Message Record</button>
                        </div> 
                    }

                    <div className="replybox mt-1 flex-row-center-between">
                        {selectedOrder && selectedOrder.isClosed ? <>
                            <textarea disabled={true} className="input" placeholder="Order is Closed" ></textarea>
                            {/* <img className="closed" src="/icons/paper-plane-solid.svg" alt="" /> */}
                            <PaperPlane color={theme === "dark" ? "white" : "black"} className="closed img" />
                        </> : 
                        selectedOrder && selectedOrder.fromContactPage ? <>
                            <textarea disabled={true} className="input" placeholder="No Reply" ></textarea>
                            {/* <img className="closed" src="/icons/paper-plane-solid.svg" alt="" /> */}
                            <PaperPlane color={theme === "dark" ? "white" : "black"} className="closed img" />
                        </> : 
                        <>
                            <textarea disabled={isSettingsOpen} className="input"></textarea>
                            {/* <img onClick={e => {!isSettingsOpen && handleSendMessage(e)}} src="/icons/paper-plane-solid.svg" alt="" /> */}
                            <PaperPlane color={theme === "dark" ? "white" : "black"} className="img" onClick={e => {!isSettingsOpen && handleSendMessage(e)}}  />
                        </>}
                    </div>
                </>}
            </div>
        </div>
    )
}
