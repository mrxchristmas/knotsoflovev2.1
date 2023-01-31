import { useState } from "react";
import { rngPassword } from "../helper/helper";



export const useSwipe =()=>{

    // usage >> enclose all children inside Swiper
    // <Swiper className="my-custom-class">
        
    // </Swiper>
    // swiper is a div so you can use it for styling as well


    
    const [swipeDirection, setSwipeDirection] = useState(null);


    function Swiper ({ children, className }){

        const [yDown, setyDown] = useState(null)
        const [xDown, setxDown] = useState(null)


        function getTouches(evt) {
            return evt.touches ||             // browser API
                evt.originalEvent.touches; // jQuery
        }
        const handleMobileTouchStart =(evt)=>{
            const firstTouch = getTouches(evt)[0];                                      
            setxDown(firstTouch.clientX)                                      
            setyDown(firstTouch.clientY)  
            console.log('test')
        }
        const handleMobileTouchMove =(evt)=>{
            if ( ! xDown || ! yDown ) {
                return;
            }

            let xUp = evt.touches[0].clientX;                                    
            let yUp = evt.touches[0].clientY;

            let xDiff = xDown - xUp;
            let yDiff = yDown - yUp;
                                                                                    
            if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
                if ( xDiff > 0 ) {
                    /* right swipe */ 
                    // console.log('Next Date')
                    setSwipeDirection({
                        direction: 'right',
                        id: rngPassword()
                    })
                } else {
                    /* left swipe */
                    // console.log('Prev Date')
                    setSwipeDirection({
                        direction: 'left',
                        id: rngPassword()
                    })
                }                       
            } else {
                if ( yDiff > 0 ) {
                    /* down swipe */ 
                    // console.log('down swipe')
                    setSwipeDirection({
                        direction: 'down',
                        id: rngPassword()
                    })
                } else { 
                    /* up swipe */
                    // console.log('up swipe')
                    setSwipeDirection({
                        direction: 'up',
                        id: rngPassword()
                    })
                }                                                                 
            }
            /* reset values */                                  
            setxDown(null)                                      
            setyDown(null)  
        }
        
        return(
            <div onTouchStart={handleMobileTouchStart} onTouchMove={handleMobileTouchMove} className={className}>
                {children}
            </div>
        )
    }
   

    return { swipeDirection, Swiper }
}


