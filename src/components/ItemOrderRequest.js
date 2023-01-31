
import { Timestamp } from "firebase/firestore";
import { rngPassword } from "../helper/helper";
import { useFirestore } from "../hooks/useFirestore"
import { useAuthContext } from "../hooks/useAuthContext";
// import { useParams } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { useDocument } from "../hooks/useDocument";
import { useEffect, useState } from "react";


export default function ItemOrderRequest({ item }) {
    const { setDocument } = useFirestore('orders')
    const { user } = useAuthContext()
    // const { itemid } = useParams()
    const { toast, showToast } = useToast(2000)
    const { document: ordersObj } = useDocument('orders', user ? user.uid : null)


    const [orders, setOrders] = useState(null)


    // console.log(user);

    useEffect(() => {
        if(ordersObj){
            setOrders(ordersObj)
        }
    }, [ordersObj]);
    
    const getItems = () => {
        let ret = []
        if(orders){
            let y = false
            orders.items.forEach(_item => {
                if(_item.id === item.id) y = true 
            })
            y ? ret = orders.items : ret = [...orders.items, {
                name: item.name,
                id: item.id,
                price: item.price
            }]
        }else{
            ret = [{
                name: item.name,
                id: item.id,
                price: item.price
            }]
        }
        return ret
    }
    const getMessages = m => {
        return orders ? [...orders.messages, m] : [m]
    }

    // console.log(user)

    const handleSubmitOrderRequest = (e) => {
        const m = e.target.previousElementSibling.value

        const messages = {
            id: rngPassword(),
            createdAt: Timestamp.now(),
            sender: user.uid,
            message: m,
            read: [user.uid]
        }
        // console.log({
        //     messages: getMessages(messages),
        //     items: getItems(),
        //     user: {
        //         name: user.displayName,
        //         photoURL: user.photoURL,
        //         id: user.uid
        //     }
        // });
        setDocument(user.uid, {
            messages: getMessages(messages),
            items: getItems(),
            user: {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                id: user.uid
            },
            receiptTag: rngPassword()
        })
        .then(() => {
            showToast({
                message: "Order Request Sent!"
            })
        })
        .catch(() => {
            showToast({
                message: "An Error Occured while Sending Order Request"
            })
        })
    }


    return (<>
        {toast}
        <p className="minitext text-red">Please include where you want to be contacted back (eg. phone, email, or in app)</p>
        <textarea className="input" placeholder='ask a question or a special request eg(colors, size, etc.)'></textarea>
        {user ? 
            <button onClick={(e) => handleSubmitOrderRequest(e)} className="btn-gray">Submit Order Request</button> : 
            <button onClick={() => showToast({message: "Please Login to Submit an Order Request"})} className="btn-gray">Please Login to Order</button>
        }
    </>)
}
