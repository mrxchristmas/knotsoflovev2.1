
import { useEffect, useState } from "react";
import { useCollection } from "../hooks/useCollection"
import Select, { components } from 'react-select'
import { rngFilename, getDiscountedPrice } from "../helper/helper";
import { useFirestore } from "../hooks/useFirestore";
import { useToast } from "../hooks/useToast";
import { usePrompt } from "../hooks/usePrompt";
import { useIsMobile } from "../hooks/useIsMobile";
import { useAuthContext } from "../hooks/useAuthContext";
import { Grid1, Grid2, Grid3, Grid4 } from "../helper/iconhelper";

// import { useTest } from "../hooks/useTest";
const defaultCategory = {label: "All Categories", value: "all"}
const defaultColorType = {label: "Percent", value: "percent"}

export default function ManageDiscount() {

    const { documents } = useCollection("items")
    const { documents: colors } = useCollection("colors")
    const { documents: categories } = useCollection("category")
    const { setDocument } = useFirestore('items')
    const { setDocument: setColorDocument } = useFirestore('colors')
    const { theme } = useAuthContext()

    const { isMobile } = useIsMobile()
    const { toast, showToast } = useToast(2000)
    const { prompt, promptChoice } = usePrompt()

    const [availableColor, setAvailableColor] = useState(null);
    const [selectedColors, setSelectedColors] = useState(null);
    const [selectedColorDiscountType, setSelectedColorDiscountType] = useState(defaultColorType);
    const [selectedColorDiscountPrice, setSelectedColorDiscountPrice] = useState(0);


    const [availableCategory, setAvailableCategory] = useState(null);
    const [category, setCategory] = useState(defaultCategory);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [priceFormat, setPriceFormat] = useState(">=");
    const [salePrice, setSalePrice] = useState(0);
    const [saleMode, setSaleMode] = useState("amount");
    const [isOnSale, setIsOnSale] = useState(false);

    const [filteredItems, setFilteredItems] = useState(null);

    const [grid, setGrid] = useState(2);

    // useEffect(() => {
    //     if(documents){
    //         console.log(documents);
    //         // console.log( filterColor("2kzKARm9L8XkiwF2DqoP") );
    //         // console.log(filterCategory("CK2uErQ3b4lKRRjc8bs5"));
    //         // console.log(filterPrice(">=", "50"));
    //         // console.log(filterName("square"));
    //         // setFilteredItems(documents)
    //         // handleSearchClick()
    //     }
    // }, [documents]);

    // filter by color/s        OK
    // filter by name           OK
    // filter by price          OK
    // filter by category       OK

    // const filterColor = (doc, colors) => {
        
    //     let ret = []
    //     doc && doc.forEach(d => {
    //         d.images.forEach(img => {
    //             img.colors.forEach(c => {
    //                 colors.forEach(cc => {
    //                     if(c === cc.value){
    //                         // ret.push(d)
    //                         let x = true
    //                         ret.forEach(r => {
    //                             if(d.id === r.id){
    //                                 x = false
    //                             }
    //                         })
    //                         x && ret.push(d)
    //                     }
    //                 })
    //             })
    //         })
    //     })
    //     // console.log(ret);s
    //     return ret
    // }
    const filterCategory = (doc, cat) => {
        let ret = []
        doc && doc.forEach(d => {
            d.category === cat.value && ret.push(d)
        })
        return ret
    }
    const filterPrice = (doc, format, price) => {
        let ret = []
        doc && doc.forEach(d => {
            format === ">=" ? parseFloat(d.price) >= parseFloat(price) && ret.push(d) :
            format === "==" ? parseFloat(d.price) === parseFloat(price) && ret.push(d) :
            parseFloat(d.price) <= parseFloat(price) && ret.push(d) 
        })
        return ret
    }
    const filterName = (doc, text) => {
        let ret = []
        doc && doc.forEach(d => {
            // d.name === cat && ret.push(d)
            d.name.toLowerCase().indexOf(text.toLowerCase()) !== -1 && ret.push(d)
        })
        return ret
    }
    const filterOnSale = (doc) => {
        let ret = []
        doc && doc.forEach(d => {
            if(d.discount){
                ret.push(d)
            }
        })
        return ret
    }


    const reset = () => {
        setName("")
        setPrice(0)
        setPriceFormat("")
        setSelectedColors(null)
        setCategory(defaultCategory)
    }
    const getColorObjById = (colorid) => {
        let ret
        colors && colors.every(color => {
            if(color.id === colorid){
                ret = color
                return false
            }else{
                return true
            }
        })
        return ret
    }
    const getColorLengthOnSale = () => {
        let x = 0
        colors && colors.forEach(color => {
            if(color.discount){
                x++
            }
        })
        return x
    }

    // console.log(selectedColors);


    useEffect(() => {
        if(colors){
            let ret = []
            colors.forEach(color => {
                ret.push({
                    label: color.name,
                    value: color.id,
                    url: color.url,
                })
            })
            setAvailableColor(ret)
        }
    }, [colors]);
    useEffect(() => {
        if(categories){
            let ret = [{
                label: "All Categories",
                value: "all"
            }]
            categories.forEach(cat => {
                ret.push({
                    label: cat.title,
                    value: cat.id
                })
            })
            // console.log(ret);
            setAvailableCategory(ret)
        }
    }, [categories]);

    // const MultiValueLabel = (props) => {
    //     // console.log('awesome: ', props)
    //     return (
    //         <components.MultiValueLabel key={props.data.id} {...props} >
    //             <div key={props.data.value} title='props.data.value' >
    //                 {props.data.label}
    //             </div>
    //         </components.MultiValueLabel>
    //     );
    // };
    const SingleValue = (props) => {
        // console.log('awesome: ', props)
        return (
            <components.SingleValue key={props.data.id} {...props} >
                <div 
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        textTransform: "capitalize"
                    }} 
                    key={props.data.value}
                >
                    <img style={{
                        height: "20px",
                        width: "20px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginRight: "10px"
                    }} src={props.data.url} alt="" />
                    {props.data.label}
                </div>
            </components.SingleValue>
        );
    };
    const Option = (props) => {
        // console.log('awesome: ', props)
        return (
            <components.Option key={props.data.id} {...props} >
                <div 
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start"
                    }} 
                    key={props.data.value}
                >
                    <img style={{
                        height: "20px",
                        width: "20px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginRight: "1rem"
                    }} src={props.data.url} alt="" />
                    {props.data.label}
                </div>
            </components.Option>
        );
    };

    const handleSearchClick = () => {
        let ret = documents
        if(price !== 0){
            if(priceFormat !== ""){
                // console.log('filtering price');
                ret = filterPrice(ret, priceFormat, parseFloat(price))
            }
        }
        if(category && category.value !== 'all'){
            // console.log('filtering category');
            ret = filterCategory(ret, category)
        }
        
        if(name !== ""){
            // console.log('filtering name');
            ret = filterName(ret, name)         
        }
        if(isOnSale){
            // console.log('filtering name');
            ret = filterOnSale(ret)         
        }

        setFilteredItems(ret)
        
    }
    const handleItemSelectChange = (item) => {
        let ret = []
        filteredItems.forEach(fi => fi.id === item.id ? fi.isSelected ? ret.push({...fi, isSelected: false}) : ret.push({...fi, isSelected: true}) : ret.push({...fi}) )
        setFilteredItems(ret)
    }

    const setAllItemSelected = () => {
        setFilteredItems(filteredItems.map(fi => {
            return {...fi, isSelected: true}
        }))
    }
    const setAllItemDeselected = () => {
        setFilteredItems(filteredItems.map(fi => {
            return {...fi, isSelected: false}
        }))
    }

    const handleDiscountSubmit = () => {
        let ret = []
        filteredItems.forEach(fi => {
            if(fi.isSelected){
                ret.push(fi)
            }
        })


        if(parseFloat(salePrice) <= 0){
            showToast({
                message: "Cannot put item on sale with " + salePrice + " " + saleMode
            })
            return
        }
        if(ret.length <= 0){
            showToast({
                message: "Please select some items to put on sale"
            })
            return
        }

       
        promptChoice(`Put ${ret.length} item${ret.length > 1 ? "s" : ""} on sale with ${saleMode === "percent" ? `${salePrice}%` : `$${salePrice}` } discount. `)
        .then(() => {
            // console.log("ok");
            ret.forEach(item => {
                const obj = {...item, discount: {
                    type: saleMode,
                    price: parseFloat(salePrice)
                }}
                delete obj.isSelected
                // console.log(obj.price, getDiscountedPrice(obj.discount, obj.price));
                // console.log(obj);
                setDocument(obj.id, {...obj})
                .then(() => {
                    showToast({
                        message: "Successfully put Items on Sale"
                    })
                })
                .catch(() => {
                    showToast({
                        message: "An error occured while updating the database"
                    })
                })
            })
        })

        // console.log(saleMode, salePrice);
        // console.log(ret);
    }
    const handleDiscountRemove = () => {
        let ret = []
        filteredItems.forEach(fi => {
            if(fi.isSelected){
                ret.push(fi)
            }
        })
        promptChoice(`Remove ${ret.length} item${ret.length > 1 ? "s" : ""} discount. `)
        .then(() => {
            ret.forEach(item => {
                let obj = {...item}
                delete obj.discount
                delete obj.isSelected
                console.log(obj);
                setDocument(obj.id, {...obj})
                .then(() => {
                    showToast({
                        message: "Successfully Removed Item Discount"
                    })
                })
                .catch(() => {
                    showToast({
                        message: "An error occured while updating the database"
                    })
                })
            })
        })
    }

    const handleColorGoClick = () =>{
        console.log(selectedColors);
        if(selectedColors === null){
            showToast({
                message: "Please select a color to put on sale..."
            })
            return
        }
        if(selectedColorDiscountPrice <= 0){
            showToast({
                message: "Please Enter a number above 0"
            })
            return
        }

        const colorobj = getColorObjById(selectedColors.value)

        const discount = {
            type: selectedColorDiscountType.value,
            price: parseFloat(selectedColorDiscountPrice)
        }

        // console.log(colorobj);

        setColorDocument(colorobj.id, {
            ...colorobj,
            discount
        })
        .then(() => {
            showToast({
                message: "Successfully put Color on Sale"
            })
        })
        .catch(() => {
            showToast({
                message: "An error occured while updating the database"
            })
        })

    }
    const handleRemoveColorClick = () => {
        if(selectedColors){
            const colorobj = getColorObjById(selectedColors.value)
            delete colorobj.discount

            setColorDocument(colorobj.id, {
                ...colorobj
            })
            .then(() => {
                showToast({
                    message: "Successfully Removed Color Sale"
                })
            })
            .catch(() => {
                showToast({
                    message: "An error occured while updating the database"
                })
            })
        }else{
            showToast({
                message: "Please select a color to remove"
            })
            return
        }

    }
    const handleSaleColorClick = color => {
        setSelectedColors({
            value: color.id,
            label: color.name,
            url: color.url
        })
        setSelectedColorDiscountType({
            value: color.discount.type,
            label: color.discount.type.charAt(0).toUpperCase() + color.discount.type.slice(1)
        })
        setSelectedColorDiscountPrice(color.discount.price)
    }

  return (
    <div className={`manage-discount-main flex-col-center-start container mt-2 ${isMobile && "mobile"} ${theme}`}>
        {toast}
        {prompt}
        <h4>Colors Discount</h4>
        <hr className=" bg-black" />
        <div className={`header mt-1 flex-${isMobile ? "col-center-start" : "row-end-between"} w-100`}>
            <div className="flex-row-end-between"></div>
            <div className={`flex-col-start-start ${isMobile ? "w-100 mt-1" : "w-30"}`}>
                <p className="mini">Select Colors to put on Sale</p>
                <Select
                    className='select w-100'
                    value={selectedColors}
                    onChange={so => setSelectedColors(so)} 
                    options={availableColor}
                    // isMulti
                    components={{SingleValue, Option}}
                    innerProps={{
                        "MultiValueLabel": {
                            key: rngFilename()
                        }
                    }}
                    placeholder="Select Color"
                />
            </div>
            <div className={`flex-col-start-start ${isMobile ? "w-100 mt-1" : "w-20"}`}>
                <p className="mini">Select Type of Discount</p>
                <Select
                    className='select w-100'
                    value={selectedColorDiscountType}
                    onChange={so => setSelectedColorDiscountType(so)} 
                    options={[
                        {
                            label: "Amount",
                            value: "amount"
                        },{
                            label: "Percent",
                            value: "percent"
                        }
                    ]}
                />
            </div>
            <div className={`flex-col-start-start ${isMobile ? "w-100 mt-1" : "w-10"}`}>
                <p className="mini">{selectedColorDiscountType.label}</p>
                <input value={selectedColorDiscountPrice} onChange={e => setSelectedColorDiscountPrice(e.target.value)} type="number" className="input" />
            </div>
            <div className={`flex-col-start-start ${isMobile ? "w-100 mt-1" : "w-15"}`}>
                <p className="mini"></p>
                <button onClick={handleRemoveColorClick} className="btn-red">Remove</button>
            </div>
            <div className={`flex-col-start-start ${isMobile ? "w-100 mt-1" : "w-15"}`}>
                <p className="mini"></p>
                <button onClick={handleColorGoClick} className="btn-green">Go</button>
            </div>
            
            
            {/* <input type="text" className="input w-10" /> */}
        </div>

        <div className="header mt-1 flex-row-start-between w-100">
            <div className="flex-col-start-start w-100">
                <p className="mini">These Colors are on Sale</p>
                <div className="saleColors bg-white br-sm">
                    {colors && colors.map(color => color.discount ? <img key={color.id} onClick={() => handleSaleColorClick(color)} src={color.url} alt={color.name} title={color.name} /> : "" )}
                    {colors && getColorLengthOnSale() <= 0 && <span>Empty</span> }
                </div>
            </div>
        </div>

        <h4 className="mt-2">Items Discount</h4>
        <hr className=" bg-black" />

        <div className={`header flex-${isMobile ? "col" : "row"}-end-start w-100 mt-1`}>
            <div className={`flex-col-start-start ${isMobile ? "w-100 mt-1" : "w-40"}`}>
                <label className="" title="Select Items on Sale"> <input type="checkbox" checked={isOnSale} onChange={e => setIsOnSale(e.target.checked)}   /> {`Select Items on Sale`}</label>
                <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Search Name" />
            </div>
            <div className={`flex-col-start-start ${isMobile ? "w-100 mt-1" : "w-30"}`}>
                <div className="mini flex-row-center-even w-100">
                    {/* <legend className="minitext">Filter Price</legend> */}
                    <label title="greater or equal to"> <input type="radio" checked={priceFormat === ">=" ? true : false} name="format" onChange={() => setPriceFormat(">=")}  /> {`>=`}</label>
                    <label title="equal to"> <input type="radio" checked={priceFormat === "==" ? true : false} name="format" onChange={() => setPriceFormat("==")}  /> {`==`}</label>
                    <label title="lesser or equal to"> <input type="radio" checked={priceFormat === "<=" ? true : false} name="format" onChange={() => setPriceFormat("<=")}  /> {`<=`}</label>
                </div>
                <input type="number" className="input" value={price} onChange={e => setPrice(e.target.value)} placeholder="Enter Price" />
            </div>
            <Select
                className={`select ${isMobile ? "w-100 mt-1" : "w-40"}`}
                value={category}
                defaultValue={"all"}
                onChange={so => setCategory(so)} 
                options={availableCategory}
                placeholder="Select Category"
            />

        </div>
        
        
        <div className={`flex-row-center-center ${isMobile ? "w-100 mt-1" : "w-50"}  mt-1`}>
            <button onClick={() => reset()} className="btn-red">Reset</button>
            <button onClick={handleSearchClick} className="btn-green ml-1">Search</button>
        </div>

        {filteredItems && !isMobile &&
            <div className="w-100 mt-2 flex-col-center-center pos-relative ">
                <div className="flex-row-center-center">
                    <Grid1 color={theme === "dark" ? "white" : "black"} onClick={() => setGrid(1)} className={`grid-icon ${grid === 1 && "active"}`} />
                    <Grid2 color={theme === "dark" ? "white" : "black"} onClick={() => setGrid(2)} className={`grid-icon ml-2 ${grid === 2 && "active"}`} />
                    <Grid3 color={theme === "dark" ? "white" : "black"} onClick={() => setGrid(3)} className={`grid-icon ml-2 mr-2 ${grid === 3 && "active"}`} />
                    <Grid4 color={theme === "dark" ? "white" : "black"} onClick={() => setGrid(4)} className={`grid-icon ${grid === 4 && "active"}`} />
                </div>
                <label className="select-all-check"> <input onChange={e => e.target.checked ? setAllItemSelected() : setAllItemDeselected()} type="checkbox"/> Select All</label>
            </div>
        }

        <div className="widget-container w-100 mt-2 flex-col-center-start">
            <div className="row gap-1 w-100">
                {filteredItems && filteredItems.map(item => (
                    <div key={item.id} title={item.name} onClick={() => handleItemSelectChange(item)} className={`widget p-0-1-1-0 col-12-sm col-${grid === 1 ? "12" : grid === 2 ? "6" : grid === 3 ? "4" : "3"}-lg flex-row-start-between`}>
                        <input type="checkbox" checked={item.isSelected ? true : false} onChange={() => handleItemSelectChange(item)} className="item-select" />
                        <img src={item.images[0].url} alt="" />
                        <div className="flex-col-start-start w-70 pl-1">
                            <p className="name">{item.name}</p>
                            {!item.discount && <p>{`$${item.price}`}</p>}
                            {item.discount && <p><span className="discount text-red mr-1">{`$${item.price} `}</span> ${getDiscountedPrice(item.discount, item.price)}</p> }
                        </div>
                        {/* <span className="discount mini text-red mr-1">{`$${getDiscountedPrice(item.discount, item.price)} `}</span> */}
                    </div>
                ))}
            </div>
        </div>

        {filteredItems && 
            <div className={`${isMobile ? "w-100" : "w-50"} m-4-0`}>
                <fieldset className="flex-col-center-center p-1-2">
                    <legend className="flex-row-center-between w-100">
                        <label >Percent <input checked={saleMode === "percent" ? true : false} onChange={() => setSaleMode("percent")} type="radio" name="happy" /> </label>
                        <span className="mini text-red">enter {saleMode}</span>
                        <label className="ml-1" > <input checked={saleMode === "amount" ? true : false} onChange={() => setSaleMode("amount")} type="radio" name="happy" /> Amount</label>
                    </legend>
                    <input value={salePrice} onChange={e => setSalePrice(e.target.value)} type="number" className="input" />
                </fieldset>
                <button onClick={handleDiscountSubmit} className="btn-green mt-1">Put Items on Discount</button>
                <button onClick={handleDiscountRemove} className="btn-red mt-1">Remove Discount</button>
            </div>
        }

        


        
    </div>
  )
}
