
import '../css/Gallery.css'
import banner1 from '../assets/itemimages/banner1.png'
import { useEffect, useRef, useState } from 'react'
import { scrollToTop } from '../helper/helper'
import { useIsMobile } from '../hooks/useIsMobile'
import { useCollection } from '../hooks/useCollection'
import { NavLink, useParams } from 'react-router-dom'
import GalleryPage from '../components/GalleryPage'
import { useAuthContext } from '../hooks/useAuthContext'
import Footer from '../components/Footer'

export const Gallery = () => {

  const { isMobile } = useIsMobile()
  const { categoryid } = useParams()
  
  const { documents: categoryObj } = useCollection('category')
  // const { documents: items } = useCollection('items')

  const [selectedCategory, setSelectedCategory] = useState(null);
  const { theme } = useAuthContext()
  // const [selCatItems, setSelCatItems] = useState(null)

  const [nav, setNav] = useState(false);
  const catRef = useRef(null)

  useEffect(() => {
    if(categoryObj){
      categoryObj.every(cat => {
        if(cat.id === categoryid){
          setSelectedCategory(cat)
          return false
        }else{
          return true
        }
      })
    }
  }, [categoryid, categoryObj]);
  

  useEffect(() => {
    if(isMobile){
      if(!categoryid){
        setNav(true)
      }
    }
  }, [isMobile, categoryid, setNav]);

  useEffect(() => {
    catRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [nav]);

  
  const getIsNavOpen = () => {
    if(!isMobile){
      return true
    }else{
      if(nav){
        return true
      }else{
        return false
      }
    }
  }


  return (
    <div className={`gallery-main flex-col-start-center ${theme} ${isMobile && "mobile"}`}>

      <div className={`flex-${isMobile ? "col" : "row"}-start-center w-100 mb-2`}>
      <div className="flex-row-start-center "></div>

        <div className={`gallerynav-container flex-col-center-start ${!getIsNavOpen() && "hidden" }`}>
        {isMobile && <span ref={catRef} className={`title pt-1 ${isMobile && "flex-row-center-between w-100"}`}>Categories <img onClick={() => setNav(false)} src="/icons/xmark-solid.svg"  alt=""/></span>}
          {categoryObj && categoryObj.map((cat) => (
            <NavLink 
              to={`/gallery/${cat.id}/`}
              key={cat.id} 
              onClick={() => {
                scrollToTop()
                setNav(false)
              }} 
              className="gallerynav-widget mt-1 flex-col-end-start"
              style={{backgroundColor: cat.color}}
            >
              <img src={cat.url} alt="" />
              <span className="title">{cat.title}</span>
              <div className="peel"></div>
              <div className="peel2"></div>
              <div className="peel3"></div>
            </NavLink>
          ))}
        </div>

        <div className="gallery-container  flex-col-center-start">
          <div className="gallery-header flex-col-center-start">
            <img src={banner1} alt="" />
            <span className="title mt-1 p-1">Premium Quality Handmade Macrame Merchandise <p>right at your fingertips</p></span>
            <div className="peel"></div>
          </div>
          {selectedCategory && <h1 className='mt-2' onClick={() => setNav(true)} style={{backgroundColor: selectedCategory.color}}>{selectedCategory.title}</h1>}
          <GalleryPage  />
        </div>

      </div>
      <Footer />
    </div>
  )
}