import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAuthContext } from '../hooks/useAuthContext'
import { NavLink } from 'react-router-dom'
import anon from '../assets/anonymous.jpg'
import { useIsMobile } from '../hooks/useIsMobile'
import { useLocation } from 'react-router-dom' 
import { useCollection } from '../hooks/useCollection'
import { useNavigate } from 'react-router-dom'
import { Moon, Sun } from '../helper/iconhelper'

export default function Navbar({ openNav, setUserMsgOpen }) {
  const { logout } = useAuth()
  const { user, ADMIN_UID, theme, dispatch } = useAuthContext()
  const { isMobile } = useIsMobile()
  const location = useLocation()
  const { documents: _orders } = useCollection('orders')
  const navigate = useNavigate();

  

  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if(_orders){
      // console.log(_orders);
      setOrders(_orders)
    }
  }, [_orders]);

  const getNotif = () => {
    let x = 0
    if(user.uid === ADMIN_UID){
      orders.forEach(order => {
        order.messages.forEach(om => {
          // console.log(om);
          let y = true
          om.read.forEach(id => {
            // console.log(id === user.ADMIN_UID);
            if(id === user.uid) y = false
          })
          y && x++
        })
      })
    }else{
      orders.forEach(order => {
        if(order.id === user.uid){
          order.messages.forEach(om => {
            // console.log(om);
            let y = true
            om.read.forEach(id => {
              // console.log(id === user.ADMIN_UID);
              if(id === user.uid) y = false
            })
            y && x++
          })
        }
      })
    }
    
    return x
  }


  // const x = !user.isAnonymous ? user.photoURL : anon;
  // console.log(!user.isAnonymous ? user.displayName.replace(/ .*/,'') : "Guest");
  // console.log(location.pathname);
  

  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const [themeHandle, setThemeHandle] = useState(true);

  useEffect(() => {
    if(themeHandle){
      dispatch({type: "DARK_MODE"})
    }else{
      dispatch({type: "LIGHT_MODE"})
    }
  }, [themeHandle, dispatch]);
  
  
  return (
    // <div className={`nav-main text-black flex-row-center-between p-1-2 ${location.pathname !== "/" && theme}`}>
    <div className={`nav-main text-black flex-row-center-between p-1-2 ${theme}`}>

      {isMobile && location.pathname.split('/')[1] === 'gallery' && openNav}

      <Link to="/" className='font-aureta brand-name flex-row-end-start text-straight'><h1>Knots of Love</h1></Link>
      
      <div className={`${isMobile ? "navs-mobile" : "navs"} flex-row-center-center`}>
        <NavLink to="/gallery" className="m-0-1" >Gallery</NavLink>
        <NavLink to="/testimonials" className="m-0-1">Testimonials</NavLink>
        <NavLink to="/contact" className="m-0-1">Contact</NavLink>
        <NavLink to="/about" className="m-0-1">About</NavLink>

        
      </div>

      <div className='nav-profile flex-row-center-start'>
        {/* // BELL ICON */}
        {user && orders && getNotif() > 0 && 
          <div onClick={() => user.uid === ADMIN_UID ? navigate('/manage/messages/') : setUserMsgOpen(true)} className="profile-notif flex-col-center-center mr-1">
            <p className="counter flex-row-center-center">{getNotif()}</p>
            <img className='' src='/icons/bell-solid.svg' alt="" />
          </div>
        }
        {/* THEME SELECTOR */}
        <label className={`mr-1 theme-selector flex-row-center-between _${theme}`}>
          <input type="checkbox" checked={themeHandle} onChange={e => setThemeHandle(e.target.checked)} className='theme-handle' style={{opacity: "0", position: "absolute"}} />
          <Moon color='#15293e' className="theme-icon" />
          <Sun color='#e6a01e' className="theme-icon" />
          <div className="ball"></div>
        </label>  

        {!user && <div className='flex-row-center-center login-button'>
          <NavLink to="/login">Login | Register</NavLink>
        </div>}

        {user && 
          <div className="profile-container flex-col-end-center position-relative">
            <div className="profile-img-name-container flex-row-center-end">
              <img onClick={() => setIsProfileOpen(!isProfileOpen)}  className="profile-photo" src={!user.isAnonymous ? user.photoURL : anon} referrerPolicy="no-referrer" alt="" />
            </div>
            
            {isProfileOpen && user && 
              <div className="profile-popup-container mt-1 p-1 flex-col-center-center">
              {/* <div className="face1 display-none" style={{display: 'none'}}> */}
                <div className="face1 display-none" >
                  <span className=''>Hello {!user.isAnonymous ? user.displayName.replace(/ .*/,'') : "Guest"}!</span>
                  <hr />
                  {ADMIN_UID === user.uid && <Link to="/manage" className="btn-black text-white ">Manage Website</Link> }
                  {/* {!user.isAnonymous && <button className="btn-pink mt-1">View Favorites</button> } */}
                  {!user.isAnonymous && user.uid !== ADMIN_UID && <button onClick={() => setUserMsgOpen(true)} className="btn-blue mt-1">Messages</button> }
                  {user.isAnonymous && <p>You will lose all data when you logout</p> }
                  {user.isAnonymous && <button className="btn-green">Link Guest Account</button> }
                  <button className="btn-red mt-1" onClick={() => logout()}>Logout</button>
                </div>
                <div className="face2 messenger flex-col-center-center">
                  
                </div>
              </div>
            }
            
          </div>
        }

      </div>

      

    </div>
  )
}

      


      
      
// {!isMobile && <span onClick={() => setIsProfileOpen(!isProfileOpen)}  className="profile-name">{!user.isAnonymous ? user.displayName.replace(/ .*/,'') : "Guest"}</span>}