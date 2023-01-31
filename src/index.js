import React from 'react'
import './index.css'
import App from './App'
import { AuthContextProvider } from './context/AuthContext'

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// react 18---
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </StrictMode>
);


// react 17---
// ReactDOM.render(
//   <React.StrictMode>
//     <AuthContextProvider>
//       <App />
//     </AuthContextProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// )
