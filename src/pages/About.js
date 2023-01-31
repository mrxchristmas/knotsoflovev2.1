import '../css/About.css'
import k1 from '../assets/kaye/k1.jpg'
import k2 from '../assets/kaye/k2.jpg'
import k3 from '../assets/kaye/k3.jpg'
import k4 from '../assets/kaye/k4.jpg'
import k5 from '../assets/kaye/k5.jpg'
import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useEffect } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const obj = [
  {
    src: k1,
    msg: "Hey there! I'm Kaye, pleased to make your aquiantance! Started out as a hobby and turned out a business."
  },{
    src: k2,
    msg: "I always get my raw materials from local sources whenever possible to help support our local community!"
  },{
    src: k3,
    msg: "Walking in the park with a side hustle in mind. I go to parks and pickup woods that would look beautiful in my creations."
  },{
    src: k4,
    msg: "Bringing that smile directly to you. I deliver my products directly to my customers! But only when were not that far apart LOL go pay some shipping fee instead xD"
  },{
    src: k5,
    msg: "Help me achieve my dream of making a pool of nothing but these colorful threads!"
  }
]

const lorem = " Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore nesciunt repudiandae rem, obcaecati totam magni error blanditiis harum molestias nobis soluta ducimus, dolorum necessitatibus aperiam consectetur. Illo eligendi quidem dolor?"

export default function About () {

  const { isMobile } = useIsMobile()
  const [sel, setSel] = useState(0);
  const { theme } = useAuthContext()


  useEffect(() => {
    
    const ct = setTimeout(() => {
      sel >= 4 ? setSel(0) :
      setSel(sel +1)
    }, 10000);

    return () => {
      // cleanup
      clearInterval(ct)
    };
  }, [sel]);




  return (
    <div className={`about-main flex-col-center-start w-100 ${theme} ${isMobile && "mobile"}`}>
      <h1 className={`${isMobile ? "mt-4" : "mt-3"} theme-title`}>Hi! I'm Kaye</h1>
      <div className={`page ${isMobile ? "mt-1 flex-col-center-center w-90" : "mt-4 flex-row-start-between w-70"}`}>
        <img src={obj[sel].src} alt="" />
        <span className='ml-2'>{obj[sel].msg + lorem }</span>
      </div>
      <div className="foot flex-row-center-center">
        <div onClick={() => setSel(0)} className={`circle m-0-1 ${sel === 0 && "active"} ${theme === "dark" ? "_dark" : "_light"}`}></div>
        <div onClick={() => setSel(1)} className={`circle m-0-1 ${sel === 1 && "active"} ${theme === "dark" ? "_dark" : "_light"}`}></div>
        <div onClick={() => setSel(2)} className={`circle m-0-1 ${sel === 2 && "active"} ${theme === "dark" ? "_dark" : "_light"}`}></div>
        <div onClick={() => setSel(3)} className={`circle m-0-1 ${sel === 3 && "active"} ${theme === "dark" ? "_dark" : "_light"}`}></div>
        <div onClick={() => setSel(4)} className={`circle m-0-1 ${sel === 4 && "active"} ${theme === "dark" ? "_dark" : "_light"}`}></div>
      </div>
    </div>
  )
}