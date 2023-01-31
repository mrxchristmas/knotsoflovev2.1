import { createContext, useReducer, useEffect } from 'react'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    case 'AUTH_IS_READY':
      return {  ...state, user: action.payload, authIsReady: true }
      case 'DARK_MODE':
        return {  ...state, theme: "dark" }
    case 'LIGHT_MODE':
      return {  ...state, theme: "light" }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null,
    authIsReady: false,
    ADMIN_UID: "03AespeZzUhMGPzwMpMs5bQ5fOu2",
    theme: "light"
  })

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {

      // console.log('Initial AuthContext State', user);
      
      // if (user) {
      dispatch({ type: 'AUTH_IS_READY', payload: user })
      // }

      return () => unsub()
    })
  }, [])

  console.log('AuthContext state:', state)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

}