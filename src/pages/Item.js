import '../css/Item.css'
import item1 from '../assets/itemimages/item1.png'
import { useIsMobile } from '../hooks/useIsMobile'
import { Link, useParams } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'
import { useCollection } from '../hooks/useCollection'
import { useEffect, useState } from 'react'
import { useFavorite } from '../hooks/useFavorite'
import { getDiscountedPrice, scrollToTop } from '../helper/helper'
import { useFirestore } from '../hooks/useFirestore'
import { useAuthContext } from '../hooks/useAuthContext'
import ItemOrderRequest from '../components/ItemOrderRequest'
import Footer from '../components/Footer'

export default function Item() {
    const { user, theme } = useAuthContext()
    const { isMobile } = useIsMobile()
    const { itemid } = useParams()
    const { document } = useDocument('items', itemid)
    const [selectedImage, setSelectedImage] = useState(null)
    const { setDocument } = useFirestore("users")
    
    // const [selectedColors, setSelectedColors] = useState(null);


    // const { documents: colors } = useColorsCollection(true, selectedColors)
    const { documents: colors } = useCollection('colors')
    const { documents: favs } = useFavorite()
    const [favIds, setFavIds] = useState(null)


    scrollToTop()
    // console.log(colors);


    const isFav = itemid => {
        let ret = false
        favIds && favIds.forEach(fi => {
          if(fi === itemid){
            ret = true
          }
        })
        return ret
    }
  
    const getColorObjById = colorid => {
        let ret
        colors.forEach(color => {
            if(color.id === colorid){
                ret = color
            }
        })
        return ret
    }


    const handleFavClick = itemid => {
        if(isFav(itemid)){
            setDocument(user.uid, {
                favItems: favIds.filter(fi => fi !== itemid)
            })
            .then(() => setFavIds(favIds.filter(fi => fi !== itemid)))
        }else{
            console.log(favIds);
            if(!favIds){
                setDocument(user.uid, {
                    favItems: [itemid]
                })
                .then(() => setFavIds([itemid]))
            }else{
                setDocument(user.uid, {
                    favItems: [...favIds, itemid]
                })
                .then(() => setFavIds([...favIds, itemid]))
            }
        }
    }


    useEffect(() => {
        if(document){
            // console.log(document);
            setSelectedImage(document.images[0])
        }
    }, [document]);

    useEffect(() => {
        if(favs){
            let ret = []
            favs.forEach(fav => {
                ret.push(fav.id)
            })
            setFavIds(ret)
        }
    }, [favs]);

    return (
        <div className={`item-main w-100 pt-3 flex-col-center-center ${theme}`}>
            {document && selectedImage &&  <>
                <div className={`item-details-container flex-${isMobile ? "col-center-start" : "row-start-between"} `}>
                    <div className={`item-image-container flex-${isMobile ? "colr-center" : "row-start"}-between`}>
                        <div className={`item-thumbnails-container flex-${isMobile ? "row" : "col"}-center-start`}>
                            {document.images.map((docim, index) => (
                                <img onClick={() => setSelectedImage(docim)} key={index} src={docim.url} alt="" />
                            ))}
                        </div>
                        {user && 
                            <img onClick={() => handleFavClick(itemid)} src={`/icons/${isFav(itemid) ? "favorite" : "favorite_border"}.svg`} alt="" className="fav" />
                        }
                        <img className='item-image' src={selectedImage.url} alt="" />
                    </div>
                    <div className="item-description-container flex-col-start-start">
                        <div className='title flex-row-start-between w-100'>
                            <p className='name'>{document.name}</p> 
                            {/* <p className='price'>${document.price}</p> */}
                            {document.discount? 
                                <span className='price'> <span className="sale">${document.price}</span> ${getDiscountedPrice(document.discount, document.price)}</span> : 
                                <span className='price'>${document.price}</span>
                            }
                        </div>
                        <h4>Description</h4>
                        <p>{document.description}</p>
                        <h4>Colors Used</h4>
                        <div className="colors flex-row-center-start p-1">
                            {colors && selectedImage.colors.map(color => (
                                <div key={color} className="img-container pos-relative">
                                    <img key={color} src={getColorObjById(color).url} alt={getColorObjById(color).name} title={`${getColorObjById(color).name}${getColorObjById(color).isLowOnStock ? " - Low on Stock" : ""}${getColorObjById(color).isAvailable ? " - Available" : " - Unavailable"} `} />
                                    {getColorObjById(color).discount && <img src="/icons/tag-solid.svg" alt="" className='tag' title={`${getColorObjById(color).discount.type === "amount" ? `$${getColorObjById(color).discount.price}` : `${getColorObjById(color).discount.price}%`} discount`} /> }
                                </div>
                            ))}
                        </div>
                        {document.width !== "" && <>
                            <h4>Width</h4>
                            <p>{document.width}</p>
                        </>}
                        {document.soleType !== "" && <>
                            <h4>Soletype</h4>
                            <p>{document.soleType}</p>
                        </>}
                        {document.size !== "" && <>
                            <h4>Size</h4>
                            <p>{document.size}</p>
                        </>}
                        {/* <input type="text" className="input" /> */}
                        <ItemOrderRequest item={document} />
                    </div>
                </div>
                {favs && 
                    <div className="frequent flex-col-start-start ">
                        <h3>Your Favorite Items</h3>
                        <div className="frequent-widget-container mt-1 flex-row-start-start">
                            {favs.map(fav => (
                                <Link key={fav.id} to={`/item/${fav.id}`} className="frequent-widget flex-col-center-center">
                                    <img src={fav.images[0].url} alt="" />
                                    <span>{fav.name}</span>
                                    <p>{fav.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                }
                <div className="frequent flex-col-start-start ">
                    <h3>Customers Most Ordered</h3>
                    <div className="frequent-widget-container mt-1 flex-row-center-start">
                        <div className="frequent-widget flex-col-center-center">
                            <img src={item1} alt="" />
                            <span>Sample Item 1</span>
                        </div>
                        <div className="frequent-widget flex-col-center-center">
                            <img src={item1} alt="" />
                            <span>Sample Item 2</span>
                        </div>
                        <div className="frequent-widget flex-col-center-center">
                            <img src={item1} alt="" />
                            <span>Sample Item 3</span>
                        </div>
                        <div className="frequent-widget flex-col-center-center">
                            <img src={item1} alt="" />
                            <span>Sample Item 4</span>
                        </div>
                        <div className="frequent-widget flex-col-center-center">
                            <img src={item1} alt="" />
                            <span>Sample Item 5</span>
                        </div>
                        <div className="frequent-widget flex-col-center-center">
                            <img src={item1} alt="" />
                            <span>Sample Item 6</span>
                        </div>
                    </div>
                    
                </div>
            </>}
            <Footer />
        </div>
    )
}
