
import { getDateNow, getMonthObject, getDateNowToText, dateTextToWord, rngPassword, qrcode } from "../helper/helper"
import { useEffect, useRef, useState } from "react";
import { useSales } from "../hooks/useSales";
import staticlogo from '../assets/logostatic.svg'
import { useReactToPrint } from 'react-to-print'
import { useFirestore } from "../hooks/useFirestore";
import { useToast } from "../hooks/useToast";
import { useIsMobile } from "../hooks/useIsMobile";
import { useAuthContext } from "../hooks/useAuthContext";
import { CaretLeft, CaretRight, Print, Xmark } from "../helper/iconhelper";

export default function ManageSales() {

    const qrcodeBaseURL = 'http://localhost:3000/writetestimonials/'
    const { isMobile } = useIsMobile()
    const { theme } = useAuthContext()

    const z = getDateNow()
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ]
    

    const getNextMonth = () => {
        let index = 0
        months.forEach((m,i) => {
            if(selectedMonth === m){
                if((i + 1) >= months.length){
                    index = 0
                }else{
                    index = (i + 1)
                }
            }
        })
        return `${months[index]}-01-${z.year}`
    }
    const getPrevMonth = () => {
        let index = 0
        months.forEach((m,i) => {
            if(selectedMonth === m){
                if((i - 1) < 0){
                    index = 11
                }else{
                    index = (i - 1)
                }
            }
        })
        return `${months[index]}-01-${z.year}`
    }

    const { setDocument } = useFirestore("testimony")

    const [monthObj, setMonthObj] = useState(getMonthObject( getDateNowToText() ))
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [selectedMonthText, setSelectedMonthText] = useState(null)
    const [selectedWeek, setSelectedWeek] = useState(null)
    const [selectedWeekText, setSelectedWeekText] = useState(null)

    const [firstDate, setFirstDate] = useState(null)
    const [lastDate, setLastDate] = useState(null)
    const [salesParam, setSalesParam] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [isThanksCardOpen, setIsThanksCardOpen] = useState(false);
    const [isTestimonyTicketOpen, setIsTestimonyTicketOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(true);

    const printComponentRef = useRef(null)

    const [receiptSortedSales, setReceiptSortedSales] = useState(null);
    const [selectedPrintSale, setSelectedPrintSale] = useState(null);
    const [shippingPrice, setShippingPrice] = useState(0);

    const [testimonyId] = useState(rngPassword());
    const qrcodeURL = qrcode(`${qrcodeBaseURL}${testimonyId}`)
    

    
    const { documents: sales } = useSales(salesParam)
    const { toast, showToast } = useToast(2000)


    const getTotalSaleAmount = items => {
        let x = 0
        items.forEach(i => {
            x += i.salePrice
        })
        return x
    }
    const formatNum = num => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }
    const createReceiptSortedSales = (_sales) => {
        // console.log(_sales);
        let newSalesObj = []
        const newTemplate = (sale, sameReceiptTag=false) => {
            return !sameReceiptTag ? {
                id: rngPassword(),
                buyerid: sale.buyerid,
                buyerName: sale.buyerName,
                buyerEmail: sale.buyerEmail,
                buyerPhotoURL: sale.buyerPhotoURL,
                createdAt: sale.createdAt,
                item: [
                    {
                        id: sale.itemid,
                        name: sale.item.name,
                        price: sale.item.price,
                        salePrice: sale.salePrice
                    }
                ],
                receiptTag: sale.receiptTag
            } : {
                id: sale.itemid,
                name: sale.item.name,
                price: sale.item.price,
                salePrice: sale.salePrice
            }
        }
        const findAndAppendItem = (receiptTag, sale) => {
            let i
            if(newSalesObj.length > 0){
                let y = false
                newSalesObj.every((nso, index) => {
                    if(nso.receiptTag === receiptTag){
                        i = index
                        y = true
                        return false
                    }else {
                        return true
                    }
                })
                if(y){
                    newSalesObj[i].item.push(newTemplate(sale, true))
                }else{
                    newSalesObj.push(newTemplate(sale))
                }
            }else{
                newSalesObj.push(newTemplate(sale))
            }
        }

        _sales.forEach(sale => {
            findAndAppendItem(sale.receiptTag, sale)
        })
        return newSalesObj
    }
    const handleAfterPrint = () => {
        console.log(selectedPrintSale)
        // console.log(qrcodeURL);
        // id: testimonyId,
        if(isTestimonyTicketOpen){

            const obj = {
                writerid : selectedPrintSale.buyerid,
                writerName: selectedPrintSale.buyerName,
                writerEmail: selectedPrintSale.buyerEmail,
                writerPhotoURL: selectedPrintSale.buyerPhotoURL,
                items: selectedPrintSale.item,
                testimony : "",
                isAvailable : true,
                isValidated : false,
                showOnPage : false
            }

            setDocument(testimonyId, obj)
            .then(() => {
                showToast({
                    message: "Created Testimony Ticket"
                })
            })
            .catch(() => {
                showToast({
                    message: "Erro Creating Testimony Ticket"
                })
            })

        }
    }
    const handlePrint = useReactToPrint({
        content: () => printComponentRef.current,
        copyStyles: true,
        onAfterPrint : handleAfterPrint,
        documentTitle : `${selectedPrintSale ? selectedPrintSale.buyerName : "Guest"}_INVOICE_${selectedPrintSale? selectedPrintSale.receiptTag : rngPassword()}`
    });

    // handleAfterPrint()
    


    useEffect(() => {
        const c = [
            {
                month: "01",
                monthText: "January"
            },{
                month: "02",
                monthText: "February"
            },{
                month: "03",
                monthText: "March"
            },{
                month: "04",
                monthText: "April"
            },{
                month: "05",
                monthText: "May"
            },{
                month: "06",
                monthText: "June"
            },{
                month: "07",
                monthText: "July"
            },{
                month: "08",
                monthText: "August"
            },{
                month: "09",
                monthText: "September"
            },{
                month: "10",
                monthText: "October"
            },{
                month: "11",
                monthText: "November"
            },{
                month: "12",
                monthText: "December"
            } 
        
        ]
        
        if(monthObj && monthObj.length > 0){
            // console.log(monthObj);
            const x = monthObj[0][6].split('-')[0]
            
            let fdindex = 0
            let ldindex = 0
            setSelectedMonth(x)
            c.forEach(m => {
                if(x === m.month){
                    setSelectedMonthText(m.monthText)
                }
            })

            

            if(selectedWeek === null){ // get first and last date of month
                setSelectedWeekText("All Weeks")

                let fx = false // check if (last week of month) array is all from the same month
                monthObj[monthObj.length - 1].every((mo) => {
                    if(mo.split('-')[0] !== selectedMonth){
                        fx = true
                        return false
                    }else{
                        return true
                    }
                })

                if(fx){ // calculatoin if some dates of (last week of month) are not from same month
                    monthObj[monthObj.length - 1].every((mo, index) => {
                        if(mo.split('-')[0] !== selectedMonth){
                            // console.log('run this sht once');
                            ldindex = index - 1
                            return false
                        }else{
                            return true
                        }
                    })
                    setLastDate(monthObj[monthObj.length - 1][ldindex])
                }else{ // every date on (last week of month) are from the same month, just get last index of week
                    setLastDate(monthObj[monthObj.length - 1][6])
                }

                monthObj[0].every((mo, index) => {
                    if(mo.split('-')[0] === selectedMonth){
                        // console.log('run this sht once');
                        fdindex = index
                        return false
                    }else{
                        return true
                    }
                })



                
                

                setFirstDate(monthObj[0][fdindex])

            }else{ // get first and last date of week
                let x = false // check if selected week array is all from the same month
                monthObj[selectedWeek].every((mo) => {
                    if(mo.split('-')[0] !== selectedMonth){
                        x = true
                        return false
                    }else{
                        return true
                    }
                })
                if(x){ // some dates are from different month, lets remove them
                    monthObj[selectedWeek].every((mo, index) => {
                        if(mo.split('-')[0] === selectedMonth){
                            fdindex = index
                            return false
                        }else{
                            return true
                        }
                    })
                    if(selectedWeek !== 0){ // check if its the first week or last week that have different months
                        // last week of month calculation
                        monthObj[selectedWeek].every((mo, index) => {
                            if(mo.split('-')[0] !== selectedMonth){
                                ldindex = index - 1
                                return false
                            }else{
                                return true
                            }
                        })
                        setLastDate(monthObj[selectedWeek][ldindex])
                    }else{  // first week of month just get the last date in index
                        setLastDate(monthObj[selectedWeek][6])
                    }
                    
                    setFirstDate(monthObj[selectedWeek][fdindex])
                }else{ // all dates are from the same month
                    setFirstDate(monthObj[selectedWeek][0])
                    setLastDate(monthObj[selectedWeek][6])
                }

                let n = parseInt(selectedWeek + 1)
                let suff = ""
                if(n === 1){
                    suff = 'st'
                }else if(n === 2){
                    suff = 'nd'
                }else if(n === 3){
                    suff = 'rd'
                }else{
                    suff = 'th'
                }
                setSelectedWeekText(`${n}${suff} Week`)

            }

        }
    }, [monthObj, selectedWeek, selectedMonth]);


    useEffect(() => {
        if(sales && sales.length > 0){
            let p = 0
            sales.forEach(sale => {
                p += sale.salePrice
            })
            setTotalPrice(p)
            // console.log(sales);
            setReceiptSortedSales(createReceiptSortedSales(sales))
        }else{
            setReceiptSortedSales(null)
        }
    }, [sales]);

    useEffect(() => {
        if(firstDate && lastDate){
            setSalesParam({
                first: firstDate,
                last: lastDate
            })
        }
    }, [firstDate, lastDate]);

    // console.log(sales);

    // const handleCreateTest = () => {
    //     const obj = {
    //         writerid : rngPassword(),
    //         writerName: "Jeffery Phillips",
    //         writerEmail: "jeffery.phillips@example.com",
    //         writerPhotoURL: "https://i.pravatar.cc/",
    //         items: [
    //             {
    //                 id: rngPassword(),
    //                 name: "Plant Hanger",
    //                 price: 20,
    //                 salePrice: 20
    //             }
    //         ],
    //         testimony : "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus laborum vitae sunt amet voluptas esse autem quo cupiditate dolor enim libero beatae similique maiores, itaque distinctio fugiat animi minus. Ipsam.",
    //         isAvailable : false,
    //         isValidated : false,
    //         showOnPage : false
    //     }

    //     setDocument(rngPassword(), obj)
    //     .then(() => {
    //         showToast({
    //             message: "Created Testimony Ticket"
    //         })
    //     })
    //     .catch(() => {
    //         showToast({
    //             message: "Erro Creating Testimony Ticket"
    //         })
    //     })
    // }


    // console.log(selectedPrintSale);
      

  return ( 
    <>
        {toast}
        {/* <button onClick={handleCreateTest} className="btn">Create</button> */}
        {isPrintOpen && 
            <div className={`manage-sales-print shadow-3 container flex-col-center-start  p-1-2 ${isMobile ? "mobile" : "mt-2"} ${theme === "dark" ? "bg-darkaccent _dark" : " bg-white _light"} `}>
                <div className={`header w-100 flex-${isMobile ? "colr" : "row"}-center-between pb-2`}>
                    <div className={`actions flex-row-center-start ${isMobile ? "w-100" : "w-70"}`}>
                        <label className="mr-1"> <input checked={isInvoiceOpen} onChange={e => setIsInvoiceOpen(e.target.checked)} type="checkbox"/> Invoice</label>
                        <label className="mr-1"> <input checked={isThanksCardOpen} onChange={e => setIsThanksCardOpen(e.target.checked)} type="checkbox"/> Thank you card</label>
                        {selectedPrintSale.buyerEmail && <label className="mr-1"> <input checked={isTestimonyTicketOpen} onChange={e => setIsTestimonyTicketOpen(e.target.checked)} type="checkbox"/> Testimony Ticket</label>}
                        <Print color={theme === "dark" ? "white" : "black"} onClick={handlePrint} className="img mr-1" />
                    </div>
                    <div className={`flex-row-${isMobile ? "center-between w-100 mb-1" : "center-end w-40"}`}>
                        <div className="flex-col-start-start minitext">
                            <p>Shipping Fee (keep 0 for FREE shipping)</p>
                            <input className="w-80 mr-4 shadow-1 bg-whitesmoke shipping-input" type="number" value={shippingPrice} onChange={e => setShippingPrice(e.target.value)}  placeholder="Enter Shipping Price, 0 for FREE" />
                        </div>
                        <Xmark color={theme === "dark" ? "white" : "black"} onClick={() => setIsPrintOpen(false)} className="img close" />
                    </div>
                </div>
                <div className={`content w-100 bg-gray p-2 flex-col-${isMobile ? "center" : "center"}-start`}>
                    
                    <div ref={printComponentRef} className="paper-print ">
                        {isInvoiceOpen && 
                            <div className="paper flex-col-center-center">
                                
                                <div className="paper-space mt-4">
                                    <div className="pb-2 flex-row-start-between w-100">
                                        <div className="flex-row-center-start">
                                            <img className="paper-logo" src={staticlogo} alt="" />
                                            <div className="flex-col-start-center ml-1">
                                                <h2 className="font-aureta paper-font-aureta">Knots of Love</h2>
                                                <p className="paper-sub">&nbsp;Ajax ON, L1T 2W7</p>
                                                <p className="paper-sub paper-web">&nbsp;https://knotsoflove.to</p>
                                            </div>
                                        </div>
                                        <div className="flex-col-start-end">
                                            <h1>INVOICE</h1>
                                            <p>{dateTextToWord(`${z.month}-${z.day}-${z.year}`, "MMMM DD, YYYY")}</p>
                                        </div>
                                    </div>
                                    <h1>Knots Of Love</h1>
                                    <p>Maker of premium quality handmade macrame products</p>
                                    <div className="flex-row-center-between w-100 mt-3 paper-border-top">
                                        <div className="flex-col-start-start">
                                            <h4>Bill to</h4>
                                            <p>{selectedPrintSale.buyerName}</p>
                                            <p>{selectedPrintSale.buyerEmail}</p>
                                        </div>
                                        <div className="flex-col-end-start">
                                            <h4>Payment</h4>
                                            <p>${ formatNum(getTotalSaleAmount(selectedPrintSale.item)) }</p>
                                        </div>
                                    </div>
                                    <div className="flex-col-center-start mt-2 paper-border-top w-100">
                                        <div className="w-100 p-1 flex-row-center-between">
                                            <div className="paper-col-item flex-col-start-center">
                                                <h4>Item</h4>
                                            </div>
                                            <div className="paper-col-price flex-col-center-center">
                                                <h4>Price</h4>
                                            </div>
                                            <div className="paper-col-amount flex-col-center-center">
                                                <h4>Amount</h4>
                                            </div>
                                        </div>
                                        {selectedPrintSale.item.map(i => (
                                            <div key={i.id} className="w-100 flex-row-center-between paper-border-top p-1">
                                                <div className="paper-col-item flex-col-start-center">
                                                    <p>{i.name}</p>
                                                </div>
                                                <div className="paper-col-price flex-col-center-center">
                                                    <p>${formatNum(i.price)}</p>
                                                </div>
                                                <div className="paper-col-amount flex-col-center-center">
                                                    <p>${formatNum(i.salePrice)}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {/* <div className="w-100 flex-row-center-between paper-border-top p-1">
                                            <div className="paper-col-item flex-col-start-center">
                                                <p>Makuna Hatata</p>
                                            </div>
                                            <div className="paper-col-price flex-col-center-center">
                                                <p>$59</p>
                                            </div>
                                            <div className="paper-col-amount flex-col-center-center">
                                                <p>$57</p>
                                            </div>
                                        </div> */}
                                        <div className="w-100 flex-row-center-between paper-border-top p-1">
                                            <p>Shipping</p>
                                            <p>{shippingPrice > 0 ? `$${shippingPrice}` : "FREE"}</p>
                                        </div>
                                        <div className="w-100 flex-row-center-between">
                                            <h4>Total</h4>
                                            <p>${formatNum(parseFloat(getTotalSaleAmount(selectedPrintSale.item)) + parseFloat(shippingPrice))}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        } {/* isInvoiceOpen end */}

                        {isThanksCardOpen && 
                            <div className="paper flex-col-center-center">
                                <div className="paper-space mt-4 flex-col-start-start">
                                    <span>{dateTextToWord(`${z.month}-${z.day}-${z.year}`, "MMMM DD, YYYY")}</span>
                                    <p className="mt-2">Kaye ExPression Frianeza</p>
                                    <p className="">Knots of Love by Kaye</p>
                                    <p className="paper-web">https://knotsoflove.to</p>
                                    <p className="mt-3">Dear {selectedPrintSale.buyerName},</p>
                                    <p className="mt-1">Hello Friend! Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus autem impedit, corporis dolorum voluptas, praesentium error voluptatibus non recusandae accusantium nihil doloremque aut porro eligendi accusamus nulla a quisquam neque. Lorem</p>
                                    <p className="mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione debitis necessitatibus at?</p>
                                    <p className="mt-5">Sincerely,</p>
                                    <p className="font-aureta paper-font-aureta">Kaye Expression Frianeza</p>
                                </div>
                            </div>
                        }{/* isThanksCardOpen end */}
                        
                        {isTestimonyTicketOpen && 
                            <div className="paper flex-col-center-center">
                                <div className="paper-space mt-4 flex-col-center-start">
                                    <img src={staticlogo} alt="" className="paper-testimony-header" />
                                    <h1 className="font-aureta paper-font-aureta huge paper-z1 mt-4">Knots of Love</h1>
                                    <p className="paper-z1">by Kaye</p>
                                    <p className="mt-3 text-align-center">is excited to announce that </p>
                                    <p className="text-align-center">you have been selected to get a <b>$5 OFF</b> on your next purchase </p>
                                    <p className="text-align-center">when you write a <b>Testimony</b> on our website regarding</p>
                                    <p className="text-align-center"> your thoughts on the product/s you bought!</p>

                                    <p className="mt-4">To participate, please follow this link or scan the image below.</p> 
                                    <p className="paper-web">{`${qrcodeBaseURL}${testimonyId}`}</p> 
                                    <p className="paper-sub">To scan the image, just open your smartphone's camera and shoot at the image below</p>
                                    <p className="paper-sub">Please do not share this link to anyone because this may contain sensitive information.</p>
                                    <img className="mt-5" src={qrcodeURL} alt="" />
                                </div>
                            </div>
                        }{/* isTestimonyTicketOpen end */}
                    </div>
                </div>


            </div>
        }
        <div className={`manage-sales-main container flex-col-center-start mt-1 ${theme}`}>
            <div className={`header flex-row-center-between ${isMobile ? "w-100" : "w-50"}`}>
                {/* <img onClick={() => {
                    setSelectedWeek(null)
                    setMonthObj(getMonthObject( getPrevMonth() ))
                }} src="/icons/caret-left-solid.svg" alt="" /> */}
                <CaretLeft color={theme === "dark" ? "white" : "black"} className="img" onClick={() => {
                    setSelectedWeek(null)
                    setMonthObj(getMonthObject( getPrevMonth() ))
                }} />
                <h3 className="bg-white shadow-1">{selectedMonthText} {z.year}</h3>
                {/* <img onClick={() => {
                    setSelectedWeek(null)
                    setMonthObj(getMonthObject( getNextMonth() ))
                }} src="/icons/caret-right-solid.svg" alt="" /> */}
                <CaretRight className="img" color={theme === "dark" ? "white" : "black"} onClick={() => {
                    setSelectedWeek(null)
                    setMonthObj(getMonthObject( getNextMonth() ))
                }} />
            </div>
            <div className={`weekheader flex-row-center-center ${isMobile ? "w-90" : "w-30"}`}>
                {firstDate && lastDate && <h3 className="bg-white shadow-1">{dateTextToWord(firstDate)} - {dateTextToWord(lastDate)}</h3>}
            </div>
            <div className={`weekheader flex-row-center-between ${isMobile ? "w-90" : "w-30"}`}>
                {/* <img onClick={() => {
                    selectedWeek === null ? setSelectedWeek(monthObj.length - 1) :
                    selectedWeek - 1 < 0 ? setSelectedWeek(null) : 
                    setSelectedWeek(selectedWeek - 1) 
                }} src="/icons/caret-left-solid.svg" alt="" /> */}
                <CaretLeft className="img" color={theme === "dark" ? "white" : "black"} onClick={() => {
                    selectedWeek === null ? setSelectedWeek(monthObj.length - 1) :
                    selectedWeek - 1 < 0 ? setSelectedWeek(null) : 
                    setSelectedWeek(selectedWeek - 1) 
                }} />
                
                <h3 className="bg-white shadow-1">{selectedWeekText}</h3>
                {/* <img onClick={() => {
                    selectedWeek === null ? setSelectedWeek(0) :
                    selectedWeek + 1 > monthObj.length - 1 ? setSelectedWeek(null) : 
                    setSelectedWeek(selectedWeek + 1) 
                }} src="/icons/caret-right-solid.svg" alt="" /> */}
                <CaretRight className="img" color={theme === "dark" ? "white" : "black"} onClick={() => {
                    selectedWeek === null ? setSelectedWeek(0) :
                    selectedWeek + 1 > monthObj.length - 1 ? setSelectedWeek(null) : 
                    setSelectedWeek(selectedWeek + 1) 
                }} />
            </div>

            <div className={`list flex-col-center-start ${isMobile ? "w-100" : "w-70"} mt-2`}>
                {receiptSortedSales && receiptSortedSales.length > 0 ? receiptSortedSales.map(sale => (
                    <div key={sale.id} onClick={() => {
                        setIsPrintOpen(true)
                        setSelectedPrintSale(sale)
                    }} className="widget bg-white flex-col-center-start w-90 p-1">
                        {sale.item.map(i => (
                            <div key={i.id} className="flex-row-center-between w-100">
                                <span>{i.name}</span>
                                {i.salePrice === parseFloat(i.price) ? 
                                    <span>${i.salePrice}</span> :
                                    <span><span className="sale">${i.price}</span>  ${i.salePrice}</span>
                                }
                            </div>
                        ))}
                        <div className="flex-row-center-between w-100">
                            <span className="sub">Sold to: {sale.buyerName}</span>
                            <span className="sub">{new Date(sale.createdAt.toDate()).toDateString()}</span>
                        </div>
                    </div>
                    )) : 
                    <div className="widget bg-white flex-row-center-between w-90 p-1">
                        <span>No Sales Record</span>
                    </div>
                }
                <div className="widget bg-white flex-row-center-between w-90 p-1">
                    <h4>Total</h4>
                    <span>${totalPrice}</span>
                </div>
                {/* <button className="btn-green mt-1" onClick={() => modalTest()}>Show Modal</button> */}
            </div>
        </div>
    </>
  )
}
