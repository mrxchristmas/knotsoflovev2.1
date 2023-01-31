import { useState } from "react"
import '../helper/Toast.css'

export const useImage =()=>{

    const [loaded, setLoaded] = useState(false)
    const ImageLoader = ({ url, className, loadingClassName }) => {
        return (
            <>
                {loaded ? 
                    <img
                        className={className}
                        style={loaded ? {} : {display: 'none'}}
                        src={url}
                        onLoad={() => setLoaded(true)}
                        alt=""
                    /> : 
                    <>
                        <div className={`skeleton-box ${loadingClassName}`} />
                        <img
                            style={{display: 'none'}}
                            src={url}
                            onLoad={() => setLoaded(true)}
                            // onLoad={() => setTimeout(() => {
                            //     setLoaded(true)
                            // }, 500)}
                            alt=""
                        />
                    </>
                }
            </>
        )
    }


    return { ImageLoader }

}