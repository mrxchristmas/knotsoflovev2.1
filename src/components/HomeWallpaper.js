
import logo from '../assets/logo.svg'
import { useEffect, useMemo, useState } from 'react'
import { useCollection } from '../hooks/useCollection';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

export default function HomeWallpaper() {


    // const leftTextObj = 
    const [selLeftText, setSelLeftText] = useState(0);
    // const { showcase } = useCategory()
    const { documents : showcase } = useCollection('showcase')
    const { theme } = useAuthContext()

    // const catObj = [
    //     {
    //         title: "walldecors",
    //         src: item1trans,
    //         deg: "deg-0"
    //     },{
    //         title: "wood walldecors",
    //         src: item2trans,
    //         deg: "deg-45"
    //     },{
    //         title: "bookmarkers",
    //         src: item3trans,
    //         deg: "deg-90"
    //     },{
    //         title: "sandals",
    //         src: item4trans,
    //         deg: "deg-135"
    //     },{
    //         title: "earrings",
    //         src: item5trans,
    //         deg: "deg-180"
    //     },{
    //         title: "handbags",
    //         src: item6trans,
    //         deg: "deg-225"
    //     },{
    //         title: "plant hanger",
    //         src: item7trans,
    //         deg: "deg-270"
    //     },{
    //         title: "coasters",
    //         src: item8trans,
    //         deg: "deg-315"
    //     }
    // ]
    const leftTextObj = useMemo(() => ["ulous", "orite", "tastic", "rageous", "nomenal", "lievable", "velous", "iffic", "tacular", "arkable", "redible", "ravagant", "digious", "endous", "endary", "onceivable" ]
    , [])

  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    if(showcase && selectedCategory === null){
      setSelectedCategory(showcase[0])
    }
  }, [selectedCategory, showcase]);

  useEffect(() => {
    const x = setTimeout(() => {
      if(leftTextObj[selLeftText + 1] !== undefined){
        setSelLeftText(selLeftText + 1)
      }else{
        setSelLeftText(0)
      }
    }, 5000);

    return () => {
      clearInterval(x)
    }
  }, [selLeftText, leftTextObj]);

  return (
    <div className={`home-wallpaper flex-row-center-between ${theme}`}>

      {showcase && selectedCategory && 
          <div className="wallpaper-left flex-col-start-center">
            <div className="logo-container ml-1">
              <img id="logo" src={logo} alt="" />
              <h1 className='logo-text font-aureta'>Knots of Love </h1>
              <span className="logo-alt-text font-normal"><span className='logo-alt-text-cat'>{selectedCategory.title}</span> by <b>Kaye</b></span>
            </div>
            <h1 className='wallpaper-left-text mt-3'>Grab your <span className='emphasize p-0-1 '> <span className='text-pink'>fab</span>{leftTextObj[selLeftText]}</span> <p>merchandise now!</p> </h1>
            
          </div>
        }
      

      <div className="homecat-container mr-3 flex-row-center-center">
        
        {/* <div className="center11 flex-row-center-center">
          <div className="center10 flex-row-center-center">
            <div className="center9 flex-row-center-center">
              <div className="center8 flex-row-center-center">
                <div className="center7 flex-row-center-center">
                  <div className="center6 flex-row-center-center">
                    <div className="center5 flex-row-center-center">
                      <div className="center4 flex-row-center-center">
                        <div className="center3 flex-row-center-center">
                            <div className="center2 flex-row-center-center">
                                <div className="center1 flex-row-center-center"> */}
                                    {selectedCategory && <Link className='centerImg-con' to={`gallery/${selectedCategory.categoryID}`}><img className='centerImg' src={selectedCategory.url} alt="" /></Link>}
                                {/* </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {showcase && showcase.map(cat => (
          <div key={cat.id} className={`circle ${cat.deg}`} onClick={() => setSelectedCategory(cat)}  >
            <img className='catImg' src={cat.url} alt="" />
          </div> 
        ))}
      </div>

    </div>
  )
}
