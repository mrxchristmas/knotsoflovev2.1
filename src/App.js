import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'


// import './app.css'

// components
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Testimonials from './pages/Testimonials'
import { Gallery } from './pages/Gallery'
import Item from './pages/Item'
import Manage from './pages/Manage'
import ManageCategory from './components/ManageCategory'
import ManageColors from './components/ManageColors'
import ManageItem from './components/ManageItem'
import ManageMessages from './components/ManageMessages'
import ManageSales from './components/ManageSales'
import UserMessage from './components/UserMessage'
import WriteTestimony from './pages/WriteTestimony'
import ManageDiscount from './components/ManageDiscount'


import { useState } from 'react'


function App() {
  const { user, authIsReady, ADMIN_UID, theme } = useAuthContext()

  // const [nav, setNav] = useState(false)
  // const NavButtonOpen = <img onClick={() => setNav(true)} src="/icons/menu_black_48dp.svg" alt="" />
  // const NavButtonClose = <img onClick={() => setNav(false)} src="/icons/xmark-solid.svg"  alt=""/>

  const [userMessageOpen, setUserMessageOpen] = useState(false);
  
  return (
    <div className={`App ${theme}`}>
      {authIsReady && (
        <BrowserRouter>
          <Navbar setUserMsgOpen={setUserMessageOpen} />
          <UserMessage isOpen={userMessageOpen} setIsOpen={setUserMessageOpen} />
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/login/" element={ !user ? <Login /> : <Navigate to="/" /> } />
            <Route path="/manage/" element={ user && user.uid === ADMIN_UID ? <Manage /> : <Navigate to="/" /> } >
              <Route path="/manage/category/" element={ <ManageCategory /> } />
              <Route path="/manage/colors/" element={ <ManageColors /> } />
              <Route path="/manage/item/" element={ <ManageItem /> } />
              <Route path="/manage/messages/" element={ <ManageMessages /> } />
              <Route path="/manage/sales/" element={ <ManageSales /> } />
              <Route path="/manage/discount/" element={ <ManageDiscount /> } />
            </Route>
            <Route path="/about/" element={ <About /> } />
            <Route path="/contact/" element={ <Contact /> } />
            <Route path="/testimonials/" element={ <Testimonials /> } />
            <Route path="/writetestimonials/:testimonyid" element={ <WriteTestimony /> } />
            <Route path="/item/:itemid/" element={ <Item /> } />
            <Route path="/gallery/" element={ <Gallery /> } />
            <Route path="/gallery/:categoryid" element={ <Gallery /> } />
            <Route path="*" element={ <Navigate to="/" />  } />
          </Routes>
        </BrowserRouter>
      )}

    </div>
  );
}

export default App
