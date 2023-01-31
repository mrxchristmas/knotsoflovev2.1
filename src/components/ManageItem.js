
import { useIsMobile } from '../hooks/useIsMobile'
import { useEffect, useState } from 'react'
import { MAX_FILE_SIZE, rngPassword, rngFilename } from '../helper/helper'
import { useCollection } from '../hooks/useCollection'
import Select, { components } from 'react-select'
import { useStorage } from '../hooks/useStorage'
import { useFirestore } from '../hooks/useFirestore'
import { useToast } from '../hooks/useToast'
import { usePrompt } from '../hooks/usePrompt'
import { useAuthContext } from '../hooks/useAuthContext'
import { Caret, Xmark } from '../helper/iconhelper'

export default function ManageItem() {



    
    // console.log(happy);
    const { theme } = useAuthContext()
    const { isMobile } = useIsMobile()
    const { documents: colors } = useCollection("colors")
    const { documents: categories } = useCollection("category")
    const { documents: items } = useCollection("items")
    const { addFile } = useStorage()
    const { setDocument, addDocument, deleteDocument } = useFirestore('items')
    const { showToast, toast } = useToast(2000)
    const { prompt, promptChoice } = usePrompt()

    const [itemID, setItemID] = useState(null)
    const [name, setName] = useState("")
    const [category, setCategory] = useState("null");
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [width, setWidth] = useState("")
    const [soleType, setSoleType] = useState("")
    const [size, setSize] = useState("")
    const [addImageReport, setAddImageReport] = useState(null)
    const [saveItemReport, setSaveItemReport] = useState("Properties with * are required")
    const [images, setImages] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedImageObj, setSelectedImageObj] = useState(null)
    const [selectedColors, setSelectedColors] = useState([])
    const [availableColor, setAvailableColor] = useState(null)
    const [isAvailable, setIsAvailable] = useState(false)
    
    const [isNavOpen, setIsNavOpen] = useState(true);
    
    // console.log(images);
    // console.log(selectedColors);

    // const imageref = useRef(images)
    // const selectedcolorsref = useRef(selectedColors)

    const getImageObjFromId = id => {
        let ret = {}
        images.forEach(image => {
            if(image.id === id){
                ret = image
            }
        })
        return ret
    }
    const getColorObjFromId = id => {
        let ret = {}
        colors.forEach(color => {
            if(color.id === id){
                ret = color
            }
        })
        return ret
    }
    const getItemsFromCategoryId = id => {
        let ret = []
        items.forEach(item => {
            if(item.category === id){
                ret.push(item)
            }
        })
        return ret
    }
    const reset = () => {
        setItemID(null)
        setName("")
        setCategory("null")
        setPrice(0)
        setDescription("")
        setWidth("")
        setSoleType("")
        setSize("")
        setSaveItemReport("Properties with * are required")
        setImages([])
        setSelectedImage(null)
        setSelectedImageObj(null)
        setSelectedColors([])
        setIsAvailable(false) 

        showToast({message: 'Form Reset!'})
    }
    const removeAppendImages = (id, data) => {
        const nd = images.filter(image => image.id !== id)
        const yy = [...nd, data].sort((a, b) => (a.index < b.index) ? 1 : -1)
        setImages(yy)
    }
    const addColorsToImage = (id, co) => {
        const data = getImageObjFromId(id)
        let xd = []
        co.forEach(color => {
            xd.push(color.value)
        })
        // console.log(xd)
        data.colors = xd
        removeAppendImages(id, data)
    }
    const updateImageAvailability = (id, av) => {
        const data = getImageObjFromId(id)
        data.isAvailable = av
        removeAppendImages(id, data)
        setIsAvailable(av)
    }
    const handleItemlistCatClick = e => {
        const td = e.target.parentElement.parentElement
        let cn = false
        td.className.split(' ').forEach(c => {
            console.log(c);
            if(c === "closed"){
                cn = true
            }
        })

        if(cn){
            td.classList.remove('closed')
            td.classList.add('open')
        }else{
            td.classList.remove('open')
            td.classList.add('closed')
        }
    }
    const handleProfileChange = e => {
        const _selected = e.target.files[0];
    
        if(!_selected){
            console.log('select a file');
            setAddImageReport("please select a file")
            return
        }
        if(!_selected.type.includes("image")){
            console.log('file must be an img');
            setAddImageReport("please select an image")
            return
        }
        //   console.log(_selected.size );
        if(_selected.size > MAX_FILE_SIZE){
            console.log('file too big');
            setAddImageReport("file size is too big")
            return
        }

        
        let reader = new FileReader();
        reader.readAsDataURL(_selected);
        reader.onloadend = function () {
            // console.log(e.target.parentElement.children[3].children[1].children[1]);
            // e.target.parentElement.children[3].children[1].children[1].src = reader.result
            const id = rngPassword()
            const gg = {
                index: images.length,
                id,
                file: _selected,
                src: reader.result,
                isAvailable,
                colors: []
            }
            const xx = [...images, gg]
            const yy = xx.sort((a, b) => (a.index < b.index) ? 1 : -1)

            setImages(yy)
            setSelectedImage(id)
            setSelectedImageObj(gg)
            setSelectedColors([])
            setIsAvailable(false)
        };

        
        // console.log(imageref.current)
        // console.log(_selected)
    }
    const handleColorSelectChange = (so) =>{
        console.log(so);
        setSelectedColors(so)
        addColorsToImage(selectedImage, so)
    }
    const handleRemoveItem = () => {
        setSelectedColors([])
        setIsAvailable(false)
        setSelectedImageObj(null)
        // setSelectedColors(selectedColors.filter(color => color.id !== id) )
        setImages(images.filter(image => image.id !== selectedImage))
        setSelectedImage(null)
    }
    const handleChangeImageClick = (id) => {
        const data = getImageObjFromId(id)
        const nd = []
        if(id){
            data.colors.forEach(color => {
                const x = getColorObjFromId(color);
                nd.push({
                    value: x.id,
                    label: x.name,
                    url: x.url
                })
            })
            setIsAvailable(data.isAvailable)
            setSelectedColors(nd)
            setSelectedImage(id)
            setSelectedImageObj(data)
        }
    }
    const handleSaveItemClick = () => {
        let path = ""
        let paths = []
        let imgobj = []
        let x = 0

        const ret = {
            name,
            category,
            price,
            description,
            width,
            soleType,
            size,
            images: []
        }
        const upload = (x, y, imgobj, rets) => {
            if(x === y){
                rets.images = imgobj
                addDocument(rets)
                .then(() => {
                    console.log('Added Successfully!')
                    showToast({message: 'Item Successfully Added!'})
                    reset()
                })
                .catch(err => {
                    console.log(err.message)
                    showToast({message: 'An Error Occured! Please contact your Provider...'})
                    setSaveItemReport("An Error Occured while Uploading Data... Please ask provider to delete: ", ...paths, err.message)
                })
            }
        }
        const setupload = (x, y, imgobj, rets) => {
            if(x === y){
                rets.images = imgobj
                // console.log('setupload', itemID);
                setDocument(itemID, rets)
                .then(() => {
                    console.log('Added Successfully!')
                    showToast({message: 'Item Successfully Updated!'})
                    reset()
                })
                .catch(err => {
                    console.log(err.message)
                    showToast({message: 'An Error Occured! Please contact your Provider...'})
                    setSaveItemReport("An Error Occured while Uploading Data... Please ask provider to delete: ", ...paths, err.message)
                })
            }
        }

        if(name !== ""){
            if(category !== "null"){
                if(price > 0){
                    if(description !== ""){
                        if(images.length > 0 ){
                            if(itemID === null){
                                images.forEach(image => {
                                    // console.log('addFile: ', `items/${category}/${rngFilename()}.${image.file.name.split('.').pop()}`);
                                    path = `items/${category}/${rngFilename()}.${image.file.name.split('.').pop()}`
                                    paths.push(path)
                                    addFile(path, image.file)
                                    .then((url) => {
                                        // console.log('File Uploaded: ', url);
                                        imgobj.push({
                                            url,
                                            colors: image.colors,
                                            isAvailable: image.isAvailable
                                        })
                                        x++
                                        upload(x, images.length, imgobj, ret)
                                    })
                                    .catch(err => {
                                        setSaveItemReport("An Error Occured while Uploading Image... ", err.message)
                                        return 
                                    })
                                })
                            }else{ // itemID !== null
                                let imgobj = []
                                images.forEach(image => {
                                    // console.log(image.file);
                                    if(image.file){
                                        path = `items/${category}/${rngFilename()}.${image.file.name.split('.').pop()}`
                                        paths.push(path)
                                        addFile(path, image.file)
                                        .then((url) => {
                                            console.log('File Uploaded: ', url);
                                            imgobj.push({
                                                url,
                                                colors: image.colors,
                                                isAvailable: image.isAvailable
                                            })
                                            x++
                                            setupload(x, images.length, imgobj, ret)
                                        })
                                        .catch(err => {
                                            setSaveItemReport("An Error Occured while Uploading Image... ", err.message)
                                            return 
                                        })
                                    }else{
                                        x++
                                        imgobj.push({
                                            url: image.url,
                                            colors: image.colors,
                                            isAvailable: image.isAvailable
                                        })
                                        setupload(x, images.length, imgobj, ret)
                                    }
                                })
                            }

                        }else{
                            setSaveItemReport("Please Add Atleast 1 Image for the Item")
                        }
                    }else{
                        setSaveItemReport("Please Dont Leave Description Blank")
                    }
                }else{
                    setSaveItemReport("Please Enter a Valid Price")
                }
            }else{
                setSaveItemReport("Please Select a Category")
            }
        }else{
            setSaveItemReport("Please Enter Item Name")
        }

    }
    const handleItemClick = itemid => {
        setItemID(itemid)
        const x = items.filter(item => item.id === itemid)[0]
        // console.log(itemid);
        // console.log(items);
        // console.log(x)
        setCategory(x.category)
        setDescription(x.description)
        setName(x.name)
        setPrice(x.price)
        setSize(x.size)
        setSoleType(x.soleType)
        setWidth(x.width)


        let nd = []
        x.images.forEach((image, index) => {
            nd.push({
                ...image,
                src: image.url,
                index,
                id: rngPassword()
            })
        })
        setImages(nd)
        setSelectedImage(null)

    }

    const handleDeleteItemClick = () => {
        console.log(name);
        promptChoice(`Delete Item: ${name}?`)
        .then(() => {
            deleteDocument(itemID)
            .then(() => {
                reset()
                showToast({message: 'Deleted Item Successfully!'})
            })
            .catch(() => {
                showToast({message: 'An Error Occured while Deleting Item...'})
            })
        })
        .catch(() => {
            showToast({message: 'Cancelled Deleting Item'})
        })
    }

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
        if(addImageReport){
            setTimeout(() => {
                setAddImageReport(null)
            }, 2000);
        }
    }, [addImageReport]);

    const MultiValueLabel = (props) => {
        // console.log('awesome: ', props)
        return (
            <components.MultiValueLabel key={props.data.id} {...props} >
                <div key={props.data.value} title='props.data.value' >
                    {props.data.label}
                </div>
            </components.MultiValueLabel>
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
    return (<>
        {toast}
        {prompt}
        <div className={`manage-item-main p-1-2  w-100 flex-${isMobile ? "col" : "row"}-start-between ${theme}`}>
            {isMobile && <button onClick={() => setIsNavOpen(true)} className="btn-yellow mb-1">Select Item</button>}
            {showNavQuery() && 
                <div className={`itemlist-container flex-col-center-start ${isMobile && "mobile"} ${theme}`}>
                    <button onClick={() => reset()} className="btn-purple">Add New Item</button>
                    {isMobile && 
                        // <img onClick={() => setIsNavOpen(false)} className="close p-1" src="/icons/xmark-solid.svg" alt="" />
                        <div className='flex-row-center-end w-100'>
                            <Xmark onClick={() => setIsNavOpen(false)} className="close p-1" color={`${theme === "dark" ? "white" : "black"}`} />
                        </div>
                    }
                    {categories && items && categories.map(cat => (
                        <div key={cat.id} className={`category-wrapper closed w-100 flex-col-center-start ${theme === "dark" && "text-white"}`}>
                            <div className="header flex-row-center-end">
                                <h3 className="flex-row-center-start" onClick={e => handleItemlistCatClick(e)}><p className="pr-1">&nbsp;</p>{cat.title}</h3>
                                {/* <img src="/icons/caret-left-solid.svg" alt="" /> */}
                                <Caret direction="left" className="img left" color={`${theme === "dark" ? "white" : "black"}`} />
                                <Caret direction="down" className="img down" color={`${theme === "dark" ? "white" : "black"}`} />
                            </div>
                            <div className="item-widget-container w-100 flex-col-center-center">
                                {getItemsFromCategoryId(cat.id).length > 0 ? getItemsFromCategoryId(cat.id).map(item => (
                                    <span key={item.id} className='w-100 ' onClick={() => {
                                        handleItemClick(item.id)
                                        setIsNavOpen(false)
                                    }} >{item.name}</span>
                                )) : <span>No Items</span>
                            }
                            </div>
                        </div>
                    ))}
                </div>
            }
            <div className={`itemdesc-container ml-2 flex-col-center-start ${isMobile && "mobile"}`}>
                <div className={`manage-item-details-container flex-${isMobile ? "col-center-start" : "row-start-between"} `}>
                    <div className="manage-item-description-container flex-col-start-start">
                        <h4>Category <span className="text-red">*</span></h4>
                        <select value={category} onChange={e => setCategory(e.target.value)} className='input'>
                            <option value="null" disabled>Select a Category</option>
                            {categories && categories.map(category => (
                                <option key={category.id} value={category.id}>{category.title}</option>
                            ))}
                        </select>
                        <h4>Name <span className="text-red">*</span></h4>
                        <input value={name} onChange={e => setName(e.target.value)} type="text" className="input" placeholder='Item Name' title='Item Name' />
                        <h4>Price <span className="text-red">*</span></h4>
                        <input value={price} onChange={e => setPrice(e.target.value)}  type="number" className="input" placeholder='Item Price' title='Item Price' />
                        <h4>Description <span className="text-red">*</span></h4>
                        <textarea value={description} onChange={e => setDescription(e.target.value)}  className="input" placeholder='Item Description (include anything specific to the item eg. materials used, etc.)' title='Item Description'></textarea>
                        <h4>Width<span className="minitext">(also indicate unit measure eg. 7 in)</span> </h4>
                        <input value={width} onChange={e => setWidth(e.target.value)} type="text" className="input" placeholder='Item Width' title='Item Width' />
                        <h4>Soletype<span className="minitext">(eg. abaca, leather, etc.)</span> </h4>
                        <input value={soleType} onChange={e => setSoleType(e.target.value)}  type="text" className="input" placeholder='Item Soletype' title='Item Soletype' />
                        <h4>Size<span className="minitext">(also indicate unit measure eg. 8.5 us women)</span> </h4>
                        <input value={size} onChange={e => setSize(e.target.value)}  type="text" className="input" placeholder='Item Size' title='Item Size' />
                        <h4>Discount<span className="minitext">(select between percent discount or amount discount)</span> </h4>
                        
                        {/* <p className="minitext flex-row-center-center text-red mt-1">Properties with <span className="fs-3 p-0-1 text-red">*</span> are required</p> */}
                        <p className="minitext text-red mt-1">{saveItemReport}</p>

                    </div>
                    <div className={`manage-item-image-container flex-${isMobile ? "colr-center-between" : "col-center-start"}`}>
                        <input onChange={handleProfileChange} type="file" style={{display: 'none'}} />
                        <button onClick={e => e.target.parentElement.children[0].click()} className='btn-blue mb-1'>Add New Image</button>
                        <span className="add-image-report minitext text-red">{addImageReport}</span>
                        <div className={`flex-${isMobile ? "col" : "row"}-start-between w-100`}>
                            <div className={`manage-item-thumbnails-container flex-${isMobile ? "row" : "col"}-center-start`}>
                                {images.length > 0 ? images.map(image => (
                                    <img key={image.id} onClick={() => handleChangeImageClick(image.id)} src={image.src} alt="" />
                                )) : <div className="skeleton-box flex-col-center-end">no img yet</div> }
                            </div>
                            <div className={`manage-item-thumbnail-details flex-col-start-start ${isMobile && "mobile mb-2"}`}>
                                {selectedImage && <>
                                    <h4>Image</h4>
                                    <img className='manage-item-thumbnailImage mb-1' src={selectedImageObj ? selectedImageObj.src : ""} alt="" />
                                    <button onClick={() => handleRemoveItem()} className="btn-red mb-1">Remove</button>
                                    <h4>Colors Used <span className="minitext text-red">click on color image to delete</span> </h4>
                                    <div className="color-selector w-100 flex-row-center-between">
                                        <Select
                                            className='select'
                                            value={selectedColors}
                                            onChange={handleColorSelectChange} 
                                            options={availableColor}
                                            isMulti
                                            components={{MultiValueLabel, Option}}
                                            innerProps={{
                                                "MultiValueLabel": {
                                                    key: rngFilename()
                                                }
                                            }}
                                            getOptionValue={option => option.value}
                                            getOptionLabel={option => option.label}
                                        />
                                    </div>
                                    <div className="colors p-1-1-0-1 ">
                                        {selectedColors.length > 0 && selectedColors.map(color => (
                                            <img key={color.id} src={color.url} alt={color.name} title={color.name} />
                                        ))}
                                    </div>
                                    <label className='flex-row-center-start mb-1'> <input className='mr-1' type="checkbox" checked={isAvailable} onChange={e => updateImageAvailability(selectedImage, e.target.checked)} /> available on hand?</label>
                                    <p className="minitext text-red ">*Sale/Discounts criteria can be set on Sale Page</p>
                                </>}
                            </div>
                        </div>
                    </div>
                    
                </div>
                <button onClick={() => handleSaveItemClick()} className='btn-green mt-1'>Save</button>
                {itemID && <button onClick={() => handleDeleteItemClick()} className='btn-red mt-2'>Delete</button>}
            </div>

        </div>
    </>)
}
