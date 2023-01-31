


import { useIsMobile } from '../hooks/useIsMobile'
import { useRef } from 'react'


export default function HomeShowcase({ data: _data }) {

    const { isMobile } = useIsMobile();
    const data = useRef(_data).current
    const ref = useRef(null)
    

  return (
    <section ref={ref} style={data.style} className={`home-showcase flex-col-center-start p-3-0 ${!data.isFirst && "first" }`}>
        {data.isFirst && <span onClick={() => ref.current.scrollIntoView({ behavior: 'smooth' })} className="arrow-down-orange-xl arrow"></span>}          
        <div className="container mt-3 flex-col-center-start">
          <div className="title">
            {data.title && data.title.map((title, index) => ( <p key={index}>{title}</p> ) )}
          </div>
          <div className="subtitle mt-2">
            {data.subtitle && data.subtitle.map((subtitle, index) => ( <p key={index}>{subtitle}</p> ) )}
          </div>
        </div>
        <div className={`showcase mt-3 flex-${isMobile ? "col" : "row"}-center-center`}>
            {data.items && data.items.map((item, index) => ( 
                <div key={index} className="item flex-col-center-center">
                    <img className="merchbg" src={item.background} alt="" />
                    <img className="merch" src={item.img} alt="" />
                    <span className="merch-title">{item.title}</span>
                </div>
             ) )}
        </div>

        {data.button && <button onClick={()=> data.button.handleClick()} className="showcase-view btn-blue mt-5">{data.button.text}</button>}
      </section>
  )
}
