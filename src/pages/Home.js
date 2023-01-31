// import { useAuthContext } from "../hooks/useAuthContext"

// import { useCollection } from '../hooks/useCollection';
// import { useRef, useState } from 'react';
// import { useStorage } from '../hooks/useStorage';
// import { useAuth } from '../hooks/useAuth'
// import { useModal } from '../hooks/useModal';
// import { useToast } from '../hooks/useToast';
// import { usePrompt } from '../hooks/usePrompt'
// import { useSwipe } from '../hooks/useSwipe';
// import { useIsMobile } from "../hooks/useIsMobile";
import HomeWallpaper from "../components/HomeWallpaper";
import HomeShowcase from "../components/HomeShowcase";
import HomePromotions from "../components/HomePromotions";
import '../css/Home.css'

import pair1trans from '../assets/itemimages/pair1trans.png'
import pair2trans from '../assets/itemimages/pair2trans.png'
import pair3trans from '../assets/itemimages/pair3trans.png'

import paint1trans from '../assets/itemimages/paint1trans.png'
import paint2trans from '../assets/itemimages/paint2trans.png'
import paint3trans from '../assets/itemimages/paint3trans.png'

import item1trans from '../assets/itemimages/item1trans.png'
import item2trans from '../assets/itemimages/item2trans.png'
import item3trans from '../assets/itemimages/item3trans.png'
import HomeColors from "../components/HomeColors";
import Footer from "../components/Footer";


export default function Home() {
  
  // const { isMobile } = useIsMobile()

  const homeShowcaseObj = {
    title: ["Discover your new favorite", "macramé collections", "in pairs!"],
    subtitle: ["Look through a selection of handmade macramé merchandise", "and discover for yourself how good they look in pairs!"],
    items: [
      {
          img: pair1trans,
          background: paint1trans,
          title: "Cream of Mushroom"
      },{
          img: pair2trans,
          background: paint2trans,
          title: "Cream of Berry"
      },{
          img: pair3trans,
          background: paint3trans,
          title: "Cream of Eggplant"
      }
        
    ],
    isFirst: true,
    button: {
      text: "View All",
      handleClick: () => console.log('test')
    }
  }
  const homeShowcaseObj2 = {
    title: ["Whats New?", "look through our list of", "our latest mechandise!"],
    subtitle: ["Look through a selection of handmade macramé merchandise", "and discover for yourself how good they look in pairs!"],
    items: [
      {
          img: item1trans,
          background: paint1trans,
          title: "Cream of Mushroom"
      },{
          img: item2trans,
          background: paint2trans,
          title: "Cream of Berry"
      },{
          img: item3trans,
          background: paint3trans,
          title: "Cream of Eggplant"
      }
    ],
    isFirst: false,
    style: {backgroundColor: "#ffa4a4"}
  } 

  

  return (
    <>
      <HomeWallpaper />
      <HomeShowcase data={homeShowcaseObj} />
      <HomePromotions />
      <HomeColors />
      <HomeShowcase data={homeShowcaseObj2}/>
      <Footer />

    </>


  );
}
