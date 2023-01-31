
import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext'
import { useColorsCollection } from '../hooks/useColorsCollection'
import { Tag } from '../helper/iconhelper';


export default function HomeColors() {

  const [limit, setLimit] = useState(12);
  const { documents } = useColorsCollection(false, null, limit)

  // console.log(documents);


  const { theme } = useAuthContext()

  return (
    <section id="HomeColors" className={`colors-main mt-3 flex-col-center-start p-2 ${theme}`}>
        <h1 className='title text-align-center'>Look through our Available Colors</h1>
        <div className="colors-page container  pt-2 flex-col-center-center">
          <div className="row gap-1 w-100">
            {
              documents && documents.map((color, index) => (
                <div key={index} className="colors-page-widget p-1-2 col-6-sm col-3-md col-2-lg flex-col-center-center">
                  <div className="imgcover">
                    <img src={color.url} alt="" />
                  </div>
                  <div className={`title flex-row-center-center ${!color.isAvailable && "text-gray"}`}>
                    <span>{color.name.replaceAll('_', ' ')}</span>
                  </div>
                  {color.discount && <Tag color='#c60d0d' className="tag" />}
                </div>
              ))
            }
          </div>
        </div>
        <button onClick={() => setLimit(null)} className={`m-2-0 w-70 ${theme === "dark" ? "btn-darkaccent" : "btn-whitesmoke"}`}>View All</button>
    </section> 
  )
}
